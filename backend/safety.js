import express from "express";
import costRoutes from "./routes/costRoutes.js";
import cors from "cors";
import dotenv from "dotenv";
import pool from "./config/db.js";
import cloudinary from "./config/cloudinaryConfig.js";
import fetch from "node-fetch";
import ExcelJS from "exceljs";
import bcrypt from "bcrypt";
import sharp from "sharp";
import { queryDB } from "./config/db.js";
// import costRoutes from "./routes/costRoutes.js";
dotenv.config();

// Cloudinary configuration (moved to config/cloudinaryConfig.js)
// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// Postgres Pool setup (moved to config/db.js)
// const pool = new Pool({
//   user: process.env.PG_USER,
//   host: process.env.PG_HOST,
//   database: process.env.PG_DATABASE,
//   password: process.env.PG_PASSWORD,
//   port: process.env.PG_PORT,
// });

// pool
//   .query("SELECT NOW()")
//   .then((res) => {
//     console.log("✅ DB Connected at:", res.rows[0].now);
//   })
//   .catch((err) => {
//     console.error("❌ DB Connection Error:", err);
//   });
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", costRoutes);

const port = process.env.PORT || 3000;

setInterval(() => {
  fetch(`${process.env.BACKEND_URL}/ping`)
    .then((res) => console.log(`Self-ping status: ${res.status}`))
    .catch((err) => console.error("Ping failed:", err));
}, 1000 * 60 * 14); // every 14 minutes

// moved DB query function to config/db.js
// async function queryDB(text, params) {
//   const client = await pool.connect();
//   try {
//     const res = await client.query(text, params);
//     return res;
//   } finally {
//     client.release();
//   }
// }

// 1. Get all cost details
// app.get("/api/costingDetails", async (req, res) => {
//   try {
//     const result = await queryDB("SELECT * FROM designs");
//     res.json(result.rows);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // 2. Get cost detail by ID (including wefts and warps)
// app.get("/api/costingDetails/:id", async (req, res) => {
//   const { id } = req.params;
//   try {
//     const designRes = await queryDB(
//       "SELECT * FROM designs WHERE design_id = $1",
//       [id]
//     );
//     const weftsRes = await queryDB(
//       "SELECT * FROM wefts WHERE design_id = $1 ORDER BY weft_id ASC",
//       [id]
//     );
//     const warpsRes = await queryDB(
//       "SELECT * FROM warps WHERE design_id = $1 ORDER BY warp_id ASC",
//       [id]
//     );

//     if (designRes.rows.length === 0) {
//       return res.status(404).json({ message: "Design not found" });
//     }

//     res.json({
//       design: designRes.rows,
//       wefts: weftsRes.rows,
//       warps: warpsRes.rows,
//     });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// 3. Get yarn counts
app.get("/api/yarnCounts", async (req, res) => {
  try {
    const result = await queryDB(
      "SELECT yarn_count, hanks_wt FROM yarndetails"
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 4. Get yarn prices
app.get("/api/yarnPrice", async (req, res) => {
  try {
    const result = await queryDB(
      "SELECT yarn_count, yarnprice FROM yarndetails"
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update the edit yarn endpoint
app.put("/api/editYarn/:id", async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const { id } = req.params;
    const { yarnCount, hanksWt, yarnPrice } = req.body;

    // Get the current yarn details to compare price
    const currentYarn = await client.query(
      "SELECT yarn_count, yarnprice FROM yarndetails WHERE id = $1",
      [id]
    );

    // Update the yarn details
    const result = await client.query(
      `UPDATE yarndetails 
       SET yarn_count=$1, hanks_wt=$2, yarnprice=$3 
       WHERE id=$4 
       RETURNING *`,
      [yarnCount, hanksWt, yarnPrice, id]
    );

    // If price has changed, add to history
    if (currentYarn.rows[0].yarnprice !== yarnPrice) {
      await client.query(
        `INSERT INTO yarn_price_history (yarn_count, price, updated_by)
         VALUES ($1, $2, $3)`,
        [yarnCount, yarnPrice, "system"] // Replace 'system' with actual user if available
      );
    }

    await client.query("COMMIT");

    res.json({
      message: "Yarn updated successfully",
      updatedYarn: result.rows[0],
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Update failed:", error);
    res.status(500).json({ message: "Update failed", error: error.message });
  } finally {
    client.release();
  }
});

// Add new endpoint to get price history
app.get("/api/yarnPriceHistory/:yarnCount", async (req, res) => {
  try {
    const yarnCount = decodeURIComponent(req.params.yarnCount);
    console.log("Fetching history for yarn count:", yarnCount); // Debug log

    const result = await pool.query(
      `SELECT price, created_at, updated_by 
       FROM yarn_price_history 
       WHERE yarn_count = $1 
       ORDER BY created_at DESC`,
      [yarnCount]
    );

    console.log("Found records:", result.rows.length); // Debug log
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching price history:", error);
    res.status(500).json({ error: error.message });
  }
});

// 6. Delete Yarn
app.delete("/api/deleteYarn/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await queryDB(
      "DELETE FROM yarndetails WHERE id=$1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0)
      return res.status(404).json({ message: "Yarn not found" });

    res.json({ message: "Yarn deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Delete failed", error: error.message });
  }
});

// 7. Add new yarn
app.post("/api/addYarn", async (req, res) => {
  const { yarnCount, hanksWt, yarnPrice } = req.body;
  try {
    const result = await queryDB(
      `INSERT INTO yarndetails (yarn_count, hanks_wt, yarnprice) VALUES ($1, $2, $3) RETURNING *`,
      [yarnCount, hanksWt, yarnPrice]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Insertion failed", details: error.message });
  }
});

// 8. Get all yarn details
app.get("/api/yarnDetails", async (req, res) => {
  try {
    const result = await queryDB(
      "SELECT yarn_count, hanks_wt, yarnprice, id FROM yarndetails"
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 9. Submit costing form
app.post("/api/submit", async (req, res) => {
  const body = req.body;

  try {
    const existingRes = await queryDB(
      "SELECT * FROM designs WHERE designname = $1",
      [body.designName]
    );
    if (existingRes.rows.length > 0) {
      return res.status(409).json({ message: "Design name already exists!" });
    }

    const designDate = new Date(body.designDate.split("/").reverse().join("-"))
      .toISOString()
      .split("T")[0];

    const insertDesignRes = await queryDB(
      `INSERT INTO designs (
        designname, created_date, profitpercent, weavingcost, washingcost, mendingcost,
        transportcost, gst, width, warpcost, weftcost, designimage, designImagePublicId, subtotal, finaltotal, profit,design_status
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16 ,$17) RETURNING design_id`,
      [
        body.designName,
        designDate,
        body.profitPercent,
        body.weaving,
        body.washing,
        body.mending,
        body.transport,
        body.gst,
        body.width,
        parseFloat(body.warpCost),
        parseFloat(body.weftCost),
        body.designImage,
        body.designImagePublicId,
        body.totalCost,
        body.finaltotal,
        body.profit,
        body.designStatus,
      ]
    );

    const designId = insertDesignRes.rows[0].design_id;

    // Insert warps
    for (let i = 0; i < body.warps.length; i++) {
      const warp = body.warps[i];
      const warpWeight = parseFloat(body.warpWeights[i]);

      await queryDB(
        `INSERT INTO warps (design_id, warpcount, warpweight, initwarpcost, warpdyeing, reed, individualwarpcost, individualprofit, individualtotalcost, individualgst, individualfinalcost)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
        [
          designId,
          warp.count,
          warpWeight,
          warp.cost,
          warp.dyeing,
          parseFloat(warp.reed),
          body.individualWarpCosts[i],
          body.individualProfits[i],
          body.individualTotalCosts[i],
          body.individualGsts[i],
          body.individualFinalTotals[i],
        ]
      );
    }

    // Insert wefts
    for (let i = 0; i < body.wefts.length; i++) {
      const weft = body.wefts[i];
      const weftWeight = parseFloat(body.weftWeights[i]);

      await queryDB(
        `INSERT INTO wefts (design_id, weftcount, weftweight, initweftcost, weftdyeing, pick, individualweftcost, individualprofit, individualtotalcost, individualgst, individualfinalcost)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
        [
          designId,
          weft.count,
          weftWeight,
          weft.cost,
          weft.dyeing,
          parseFloat(weft.pick),
          body.individualWeftCosts[i],
          body.individualProfits[i],
          body.individualTotalCosts[i],
          body.individualGsts[i],
          body.individualFinalTotals[i],
        ]
      );
    }

    res.status(200).json({ message: "Design inserted successfully" });
  } catch (err) {
    console.error("Server Error:", err);
    res.status(500).json({ message: "Insert failed", error: err.message });
  }
});

// 10. Delete the report using Postgres
app.delete("/api/deleteDesign/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const designRes = await queryDB(
      "SELECT designImagePublicId FROM designs WHERE design_id=$1",
      [id]
    );

    if (designRes.rows.length === 0) {
      return res.status(404).json({ message: "Design not found" });
    }

    const publicId = designRes.rows[0].designimagepublicid;

    if (publicId) {
      await cloudinary.uploader.destroy(publicId);
    }

    const result = await queryDB(
      "DELETE FROM designs WHERE design_id=$1 RETURNING *",
      [id]
    );

    res.json({ message: "Design deleted successfully" });
  } catch (error) {
    console.error("Delete Error:", error);
    res.status(500).json({ message: "Delete failed", error: error.message });
  }
});

// API to keep the server alive
app.get("/ping", async (req, res) => {
  res.send("Server is alive!");
});

//New Costing API
app.post("/api/newDesign", async (req, res) => {
  try {
    const { designName, designImage, designImagePublicId, designDate } =
      req.body;
    console.log(req.body);

    const existingRes = await queryDB(
      "SELECT * FROM design_sampling WHERE design_name = $1",
      [designName]
    );
    if (existingRes.rows.length > 0) {
      return res.status(409).json({ message: "Design name already exists!" });
    }

    const status = "pending";

    await pool.query(
      "INSERT INTO design_sampling (design_name,designimage_url, status,designImagePublicId,created_at) VALUES ($1, $2,$3,$4,$5)",
      [designName, designImage, status, designImagePublicId, designDate] // Corrected order
    );

    res.status(200).send({ message: "Design added successfully" }); // Send success response
  } catch (error) {
    console.error(error.message);
    res.status(500).send({ message: "Server error" }); // Send error response
  }
});

//getting all the sampling to costing details
app.get("/api/samplingdetails", async (req, res) => {
  try {
    const result = await queryDB("SELECT * from design_sampling");
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/samplingdetails/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await queryDB(
      "SELECT * from design_sampling where designid = $1",
      [id]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//delete sampling_details
app.delete("/api/deleteDesign", async (req, res) => {
  try {
    const { designid } = req.body;
    const query = await queryDB(
      "DELETE FROM design_sampling where designid = $1",
      [designid]
    );
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;

    const userExists = await pool.query(
      "SELECT * FROM login WHERE username = $1",
      [username]
    );

    if (userExists.rows.length > 0) {
      return res.status(409).json({ error: "User already exists" });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const result = await pool.query(
      "INSERT INTO login (username, password) VALUES ($1, $2) RETURNING id",
      [username, hashedPassword]
    );

    res.status(201).json({
      message: "User registered successfully",
      userId: result.rows[0].id,
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const query = await pool.query("SELECT * FROM login WHERE username = $1", [
      username,
    ]);

    if (query.rows.length === 0) {
      return res.status(401).json({ error: "User not found" });
    }

    const user = query.rows[0];

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid password" });
    }

    res.json({ message: "Login successful", userId: user.id });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

//excel generation

// Update the Excel download route
app.get("/api/excel", async (req, res) => {
  try {
    const designIds = req.query.designs ? req.query.designs.split(",") : [];

    let designQuery = "SELECT * FROM designs";
    let queryParams = [];

    if (designIds.length > 0) {
      designQuery += " WHERE design_id = ANY($1)";
      queryParams.push(designIds);
    }

    const resultDesigns = await pool.query(designQuery, queryParams);
    const designs = resultDesigns.rows;

    // Use the design IDs to fetch related warps and wefts
    const resultWarps = await pool.query(
      "SELECT * FROM warps WHERE design_id = ANY($1)",
      [designs.map((d) => d.design_id)]
    );
    const warps = resultWarps.rows;

    const resultWefts = await pool.query(
      "SELECT * FROM wefts WHERE design_id = ANY($1)",
      [designs.map((d) => d.design_id)]
    );
    const wefts = resultWefts.rows;

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Design Report");

    // Update the worksheet columns configuration
    // Update the worksheet columns configuration with number formats
    worksheet.columns = [
      {
        header: "Design ID",
        key: "design_id",
        width: 10,
        style: { numFmt: "0" },
      },
      { header: "Design Name", key: "designname", width: 15 },
      { header: "Width", key: "width", width: 10, style: { numFmt: "0.00" } },
      {
        header: "Warp Count",
        key: "warpcount",
        width: 12,
      },
      {
        header: "Weft Count",
        key: "weftcount",
        width: 12,
      },
      { header: "Reed", key: "reed", width: 10, style: { numFmt: "0.00" } },
      { header: "Pick", key: "pick", width: 10, style: { numFmt: "0.00" } },
      {
        header: "initWarpCost",
        key: "initwarpcost",
        width: 12,
        style: { numFmt: "0.00" },
      },
      {
        header: "initWeftCost",
        key: "initweftcost",
        width: 12,
        style: { numFmt: "0.00" },
      },
      {
        header: "Warp Dyeing",
        key: "warpdyeing",
        width: 12,
        style: { numFmt: "0.00" },
      },
      {
        header: "Weft Dyeing",
        key: "weftdyeing",
        width: 12,
        style: { numFmt: "0.00" },
      },
      {
        header: "Warp Wt",
        key: "warpweight",
        width: 10,
        style: { numFmt: "0.000" },
      },
      {
        header: "Weft Wt",
        key: "weftweight",
        width: 10,
        style: { numFmt: "0.000" },
      },
      {
        header: "Individual Warp Cost",
        key: "individualwarpcost",
        width: 18,
        style: { numFmt: "0.00" },
      },
      {
        header: "Individual Weft Cost",
        key: "individualweftcost",
        width: 18,
        style: { numFmt: "0.00" },
      },
      {
        header: "Weaving",
        key: "weavingcost",
        width: 10,
        style: { numFmt: "0.00" },
      },
      {
        header: "Mending",
        key: "mendingcost",
        width: 10,
        style: { numFmt: "0.00" },
      },
      {
        header: "Washing",
        key: "washingcost",
        width: 10,
        style: { numFmt: "0.00" },
      },
      {
        header: "Transport",
        key: "transportcost",
        width: 10,
        style: { numFmt: "0.00" },
      },
      {
        header: "Profit",
        key: "individualprofit",
        width: 10,
        style: { numFmt: "0.00" },
      },
      {
        header: "Subtotal",
        key: "individualtotalcost",
        width: 10,
        style: { numFmt: "0.00" },
      },
      {
        header: "GST",
        key: "individualgst",
        width: 10,
        style: { numFmt: "0.00" },
      },
      {
        header: "TOTAL",
        key: "individualfinalcost",
        width: 10,
        style: { numFmt: "0.00" },
      },
    ];

    worksheet.getRow(1).eachCell((cell) => {
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "000080" },
      };
      cell.font = {
        color: { argb: "FFFFFF" },
        bold: true,
      };
      cell.alignment = {
        vertical: "middle",
        horizontal: "center",
      };
    });

    worksheet.eachRow((row, rowNumber) => {
      row.eachCell((cell) => {
        cell.alignment = {
          vertical: "middle",
          horizontal: "center",
        };
      });
    });

    worksheet.autoFilter = {
      from: "A1",
      to: "W1",
    };

    worksheet.views = [
      {
        state: "frozen",
        xSplit: 0,
        ySplit: 1,
        topLeftCell: "A2",
        activeCell: "A2",
      },
    ];

    designs.forEach((design) => {
      const relatedWarps = warps
        .filter((w) => w.design_id === design.design_id)
        .sort((a, b) => a.warp_id - b.warp_id);

      const relatedWefts = wefts
        .filter((w) => w.design_id === design.design_id)
        .sort((a, b) => a.weft_id - b.weft_id);

      const totalWarpCost = relatedWarps.reduce(
        (sum, w) => sum + (parseFloat(w.individualwarpcost) || 0),
        0
      );
      const totalWeftCost = relatedWefts.reduce(
        (sum, w) => sum + (parseFloat(w.individualweftcost) || 0),
        0
      );

      const maxLen = Math.max(relatedWarps.length, relatedWefts.length);

      for (let i = 0; i < maxLen; i++) {
        const warp = relatedWarps[i];
        const weft = relatedWefts[i];

        worksheet.addRow({
          design_id: i === 0 ? Number(design.design_id) : "",
          designname: i === 0 ? design.designname : "",
          width: i === 0 ? Number(design.width) : "",
          warpcount: warp ? warp.warpcount : "",
          weftcount: weft ? weft.weftcount : "",
          reed: warp ? Number(warp.reed) : "",
          pick: weft ? Number(weft.pick) : "",
          initwarpcost: warp ? Number(warp.initwarpcost) : "",
          initweftcost: weft ? Number(weft.initweftcost) : "",
          warpdyeing: warp ? Number(warp.warpdyeing) : "",
          weftdyeing: weft ? Number(weft.weftdyeing) : "",
          warpweight: warp ? Number(warp.warpweight) : "",
          weftweight: weft ? Number(weft.weftweight) : "",
          individualwarpcost: warp ? Number(warp.individualwarpcost) : "",
          individualweftcost: weft ? Number(weft.individualweftcost) : "",
          weavingcost: i === 0 ? Number(design.weavingcost) : "",
          mendingcost: i === 0 ? Number(design.mendingcost) : "",
          washingcost: i === 0 ? Number(design.washingcost) : "",
          transportcost: i === 0 ? Number(design.transportcost) : "",
          individualprofit: warp ? Number(warp.individualprofit) : "",
          individualtotalcost: warp ? Number(warp.individualtotalcost) : "",
          individualgst: warp ? Number(warp.individualgst) : "",
          individualfinalcost: warp ? Number(warp.individualfinalcost) : "",
        });
      }

      // Calculate totals for individual values
      const totalIndividualProfit = relatedWarps.reduce(
        (sum, w) => sum + (parseFloat(w.individualprofit) || 0),
        0
      );
      const totalIndividualCost = relatedWarps.reduce(
        (sum, w) => sum + (parseFloat(w.individualtotalcost) || 0),
        0
      );
      const totalIndividualGst = relatedWarps.reduce(
        (sum, w) => sum + (parseFloat(w.individualgst) || 0),
        0
      );
      const totalIndividualFinal = relatedWarps.reduce(
        (sum, w) => sum + (parseFloat(w.individualfinalcost) || 0),
        0
      );

      worksheet.addRow({});

      worksheet.addRow({
        design_id: "",
        designname: "",
        width: "",
        warpcount: "",
        weftcount: "",
        reed: "",
        pick: "",
        initwarpcost: "",
        initweftcost: "",
        warpdyeing: "",
        weftdyeing: "",
        warpweight: "Total",
        weftweight: "",
        individualwarpcost: Number(totalWarpCost),
        individualweftcost: Number(totalWeftCost),
        weavingcost: "",
        mendingcost: "",
        washingcost: "",
        transportcost: "",
        individualprofit: Number(totalIndividualProfit),
        individualtotalcost: Number(totalIndividualCost),
        individualgst: Number(totalIndividualGst),
        individualfinalcost: Number(totalIndividualFinal),
      });

      worksheet.addRow({});
      const emptyRow = worksheet.lastRow;
      emptyRow.height = 15;
      emptyRow.eachCell((cell) => {
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "F5F5F5" },
        };
        cell.border = {
          bottom: { style: "thin", color: { argb: "E0E0E0" } },
        };
      });

      const totalsRow = worksheet.getRow(emptyRow.number - 1);
      totalsRow.eachCell((cell) => {
        cell.border = {
          bottom: { style: "thick", color: { argb: "000000" } },
        };
        cell.font = {
          bold: true,
        };
      });
    });

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=Design_Report.xlsx`
    );
    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error("Excel generation error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Add this new route for single design Excel export
app.get("/api/excel/:designId", async (req, res) => {
  try {
    const { designId } = req.params;

    const resultDesigns = await pool.query(
      "SELECT * FROM designs WHERE design_id = $1",
      [designId]
    );
    const designs = resultDesigns.rows;

    const resultWarps = await pool.query(
      "SELECT * FROM warps WHERE design_id = $1",
      [designId]
    );
    const warps = resultWarps.rows;

    const resultWefts = await pool.query(
      "SELECT * FROM wefts WHERE design_id = $1",
      [designId]
    );
    const wefts = resultWefts.rows;

    // Use your existing Excel generation logic
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Design Report");

    worksheet.columns = [
      {
        header: "Design ID",
        key: "design_id",
        width: 10,
        style: { numFmt: "0" },
      },
      { header: "Design Name", key: "designname", width: 15 },
      { header: "Width", key: "width", width: 10, style: { numFmt: "0.00" } },
      {
        header: "Warp Count",
        key: "warpcount",
        width: 12,
      },
      {
        header: "Weft Count",
        key: "weftcount",
        width: 12,
      },
      { header: "Reed", key: "reed", width: 10, style: { numFmt: "0.00" } },
      { header: "Pick", key: "pick", width: 10, style: { numFmt: "0.00" } },
      {
        header: "initWarpCost",
        key: "initwarpcost",
        width: 12,
        style: { numFmt: "0.00" },
      },
      {
        header: "initWeftCost",
        key: "initweftcost",
        width: 12,
        style: { numFmt: "0.00" },
      },
      {
        header: "Warp Dyeing",
        key: "warpdyeing",
        width: 12,
        style: { numFmt: "0.00" },
      },
      {
        header: "Weft Dyeing",
        key: "weftdyeing",
        width: 12,
        style: { numFmt: "0.00" },
      },
      {
        header: "Warp Wt",
        key: "warpweight",
        width: 10,
        style: { numFmt: "0.000" },
      },
      {
        header: "Weft Wt",
        key: "weftweight",
        width: 10,
        style: { numFmt: "0.000" },
      },
      {
        header: "Individual Warp Cost",
        key: "individualwarpcost",
        width: 18,
        style: { numFmt: "0.00" },
      },
      {
        header: "Individual Weft Cost",
        key: "individualweftcost",
        width: 18,
        style: { numFmt: "0.00" },
      },
      {
        header: "Weaving",
        key: "weavingcost",
        width: 10,
        style: { numFmt: "0.00" },
      },
      {
        header: "Mending",
        key: "mendingcost",
        width: 10,
        style: { numFmt: "0.00" },
      },
      {
        header: "Washing",
        key: "washingcost",
        width: 10,
        style: { numFmt: "0.00" },
      },
      {
        header: "Transport",
        key: "transportcost",
        width: 10,
        style: { numFmt: "0.00" },
      },
      {
        header: "Profit",
        key: "individualprofit",
        width: 10,
        style: { numFmt: "0.00" },
      },
      {
        header: "Subtotal",
        key: "individualtotalcost",
        width: 10,
        style: { numFmt: "0.00" },
      },
      {
        header: "GST",
        key: "individualgst",
        width: 10,
        style: { numFmt: "0.00" },
      },
      {
        header: "TOTAL",
        key: "individualfinalcost",
        width: 10,
        style: { numFmt: "0.00" },
      },
    ];

    worksheet.getRow(1).eachCell((cell) => {
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "000080" },
      };
      cell.font = {
        color: { argb: "FFFFFF" },
        bold: true,
      };
      cell.alignment = {
        vertical: "middle",
        horizontal: "center",
      };
    });

    worksheet.eachRow((row, rowNumber) => {
      row.eachCell((cell) => {
        cell.alignment = {
          vertical: "middle",
          horizontal: "center",
        };
      });
    });

    worksheet.autoFilter = {
      from: "A1",
      to: "W1",
    };

    worksheet.views = [
      {
        state: "frozen",
        xSplit: 0,
        ySplit: 1,
        topLeftCell: "A2",
        activeCell: "A2",
      },
    ];

    designs.forEach((design) => {
      const relatedWarps = warps
        .filter((w) => w.design_id === design.design_id)
        .sort((a, b) => a.warp_id - b.warp_id);

      const relatedWefts = wefts
        .filter((w) => w.design_id === design.design_id)
        .sort((a, b) => a.weft_id - b.weft_id);

      const totalWarpCost = relatedWarps.reduce(
        (sum, w) => sum + (parseFloat(w.individualwarpcost) || 0),
        0
      );
      const totalWeftCost = relatedWefts.reduce(
        (sum, w) => sum + (parseFloat(w.individualweftcost) || 0),
        0
      );

      const maxLen = Math.max(relatedWarps.length, relatedWefts.length);

      for (let i = 0; i < maxLen; i++) {
        const warp = relatedWarps[i];
        const weft = relatedWefts[i];

        worksheet.addRow({
          design_id: i === 0 ? Number(design.design_id) : "",
          designname: i === 0 ? design.designname : "",
          width: i === 0 ? Number(design.width) : "",
          warpcount: warp ? warp.warpcount : "",
          weftcount: weft ? weft.weftcount : "",
          reed: warp ? Number(warp.reed) : "",
          pick: weft ? Number(weft.pick) : "",
          initwarpcost: warp ? Number(warp.initwarpcost) : "",
          initweftcost: weft ? Number(weft.initweftcost) : "",
          warpdyeing: warp ? Number(warp.warpdyeing) : "",
          weftdyeing: weft ? Number(weft.weftdyeing) : "",
          warpweight: warp ? Number(warp.warpweight) : "",
          weftweight: weft ? Number(weft.weftweight) : "",
          individualwarpcost: warp ? Number(warp.individualwarpcost) : "",
          individualweftcost: weft ? Number(weft.individualweftcost) : "",
          weavingcost: i === 0 ? Number(design.weavingcost) : "",
          mendingcost: i === 0 ? Number(design.mendingcost) : "",
          washingcost: i === 0 ? Number(design.washingcost) : "",
          transportcost: i === 0 ? Number(design.transportcost) : "",
          individualprofit: warp ? Number(warp.individualprofit) : "",
          individualtotalcost: warp ? Number(warp.individualtotalcost) : "",
          individualgst: warp ? Number(warp.individualgst) : "",
          individualfinalcost: warp ? Number(warp.individualfinalcost) : "",
        });
      }

      // Calculate totals for individual values
      const totalIndividualProfit = relatedWarps.reduce(
        (sum, w) => sum + (parseFloat(w.individualprofit) || 0),
        0
      );
      const totalIndividualCost = relatedWarps.reduce(
        (sum, w) => sum + (parseFloat(w.individualtotalcost) || 0),
        0
      );
      const totalIndividualGst = relatedWarps.reduce(
        (sum, w) => sum + (parseFloat(w.individualgst) || 0),
        0
      );
      const totalIndividualFinal = relatedWarps.reduce(
        (sum, w) => sum + (parseFloat(w.individualfinalcost) || 0),
        0
      );

      worksheet.addRow({});

      worksheet.addRow({
        design_id: "",
        designname: "",
        width: "",
        warpcount: "",
        weftcount: "",
        reed: "",
        pick: "",
        initwarpcost: "",
        initweftcost: "",
        warpdyeing: "",
        weftdyeing: "",
        warpweight: "Total",
        weftweight: "",
        individualwarpcost: Number(totalWarpCost),
        individualweftcost: Number(totalWeftCost),
        weavingcost: "",
        mendingcost: "",
        washingcost: "",
        transportcost: "",
        individualprofit: Number(totalIndividualProfit),
        individualtotalcost: Number(totalIndividualCost),
        individualgst: Number(totalIndividualGst),
        individualfinalcost: Number(totalIndividualFinal),
      });

      worksheet.addRow({});
      const emptyRow = worksheet.lastRow;
      emptyRow.height = 15;
      emptyRow.eachCell((cell) => {
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "F5F5F5" },
        };
        cell.border = {
          bottom: { style: "thin", color: { argb: "E0E0E0" } },
        };
      });

      const totalsRow = worksheet.getRow(emptyRow.number - 1);
      totalsRow.eachCell((cell) => {
        cell.border = {
          bottom: { style: "thick", color: { argb: "000000" } },
        };
        cell.font = {
          bold: true,
        };
      });
    });

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=Design_${designId}_Report.xlsx`
    );

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error("Excel generation error:", error);
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/excel/data", async (req, res) => {
  try {
    const designs = (await pool.query("SELECT * FROM designs")).rows;
    const warps = (await pool.query("SELECT * FROM warps")).rows;
    const wefts = (await pool.query("SELECT * FROM wefts")).rows;
    res.json({ designs, warps, wefts });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 1. Get all colors
app.get("/api/colors", async (req, res) => {
  try {
    const result = await queryDB("SELECT * FROM colorsdetails ORDER BY id ASC");
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 2. Add new color
app.post("/api/colors", async (req, res) => {
  try {
    const { colorValue, colorLabel } = req.body;

    // Check if color already exists
    const existingColor = await queryDB(
      "SELECT * FROM colorsdetails WHERE colorvalue = $1 OR colorlabel = $2",
      [colorValue, colorLabel]
    );

    if (existingColor.rows.length > 0) {
      return res.status(409).json({ error: "Color already exists" });
    }

    const result = await queryDB(
      "INSERT INTO colorsdetails (colorvalue, colorlabel) VALUES ($1, $2) RETURNING *",
      [colorValue, colorLabel]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to add color", details: error.message });
  }
});

// 3. Update color
app.put("/api/colors/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { colorValue, colorLabel } = req.body;

    // Check if color exists
    const existingColor = await queryDB(
      "SELECT * FROM colorsdetails WHERE id = $1",
      [id]
    );

    if (existingColor.rows.length === 0) {
      return res.status(404).json({ error: "Color not found" });
    }

    // Check if new values conflict with existing colors
    const conflictCheck = await queryDB(
      "SELECT * FROM colorsdetails WHERE (colorvalue = $1 OR colorlabel = $2) AND id != $3",
      [colorValue, colorLabel, id]
    );

    if (conflictCheck.rows.length > 0) {
      return res
        .status(409)
        .json({ error: "Color value or label already exists" });
    }

    const result = await queryDB(
      "UPDATE colorsdetails SET colorvalue = $1, colorlabel = $2 WHERE id = $3 RETURNING *",
      [colorValue, colorLabel, id]
    );

    res.json({
      message: "Color updated successfully",
      color: result.rows[0],
    });
  } catch (error) {
    res.status(500).json({ error: "Update failed", details: error.message });
  }
});

// 4. Delete color
app.delete("/api/colors/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Check if color exists
    const existingColor = await queryDB(
      "SELECT * FROM colorsdetails WHERE id = $1",
      [id]
    );

    if (existingColor.rows.length === 0) {
      return res.status(404).json({ error: "Color not found" });
    }

    await queryDB("DELETE FROM colorsdetails WHERE id = $1", [id]);

    res.json({ message: "Color deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Delete failed", details: error.message });
  }
});

// 5. Get single color by ID
app.get("/api/colors/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await queryDB("SELECT * FROM colorsdetails WHERE id = $1", [
      id,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Color not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/uploadPattern", async (req, res) => {
  try {
    const { svgContent, designName } = req.body;

    // Convert SVG string to PNG buffer using sharp
    const pngBuffer = await sharp(Buffer.from(svgContent)).png().toBuffer();

    // Convert PNG buffer to base64 Data URI
    const base64Png = pngBuffer.toString("base64");
    const dataUri = `data:image/png;base64,${base64Png}`;

    // Upload to Cloudinary as PNG
    const uploadResponse = await cloudinary.uploader.upload(dataUri, {
      folder: "warp-patterns",
      public_id: `pattern-${designName}-${Date.now()}`,
      resource_type: "image",
      format: "png", // or "jpg"
    });

    res.json({
      publicId: uploadResponse.public_id,
      url: uploadResponse.secure_url,
    });
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/save-design", async (req, res) => {
  try {
    const request = req.body;

    const queryDesigns = await queryDB(
      "INSERT into designsheet(designname) values($1) RETURNING id",
      [request.designName]
    );

    const designId = queryDesigns.rows[0].id;

    const designColorRelation = await queryDB(
      "INSERT INTO designcolorrelation(designid,colorname) values($1,$2) RETURNING id",
      [designId, request.colorName]
    );

    const designColorId = designColorRelation.rows[0].id;

    const queryWarps = await queryDB(
      "INSERT into designsheetwarp(designid, designcolorid) values($1, $2) RETURNING id",
      [designId, designColorId]
    );
    const length = request.threadWeights.length - 1;

    const warpId = queryWarps.rows[0].id;

    const queryWarpInfo = await queryDB(
      `INSERT INTO warpinfo(warpid,colorname,warpcount,reed,wastage,totalquantity,width,
      totalthreads,warpweight,threadperrepeat,ordertotalweight,totalweightperrepeat, imageurl) 
      values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13) RETURNING id`,
      [
        warpId,
        request.colorName,
        request.warps[0].count,
        request.warps[0].reed,
        request.warps[0].constant,
        request.totalOrderWidth,
        request.width,
        request.totalThreads,
        request.warpWeights[0],
        request.totalThreadSum,
        parseFloat(request.threadWeights[length].totalWeight),
        parseFloat(request.threadWeights[length].weight),
        request.patternUrl,
      ]
    );

    const warpInfoId = queryWarpInfo.rows[0].id;

    // Loop through thread weights but skip the last object
    for (let i = 0; i < request.threadWeights.length - 1; i++) {
      const threadWeight = request.threadWeights[i];
      await queryDB(
        "INSERT INTO warpcolorsinfo(warpinfoid,colorvalue,colorlabel,legend,threads,weight,totalweight,totalweightthreads) values($1,$2,$3,$4,$5,$6,$7,$8)",
        [
          warpInfoId,
          threadWeight.colorValue,
          threadWeight.color,
          threadWeight.legendNumber,
          threadWeight.singleRepeatThread,
          parseFloat(threadWeight.weight),
          parseFloat(threadWeight.totalWeight),
          threadWeight.threadCount,
        ]
      );
    }

    for (let i = 0; i < request.WarpOrder.length; i++) {
      const warpOrder = request.WarpOrder[i];
      await queryDB(
        "INSERT INTO WarpOrderColours(warpinfoid,colorvalue,colorlabel,threadcount) values($1,$2,$3,$4)",
        [
          warpInfoId,
          warpOrder.color.toLowerCase(),
          warpOrder.colorName,
          parseInt(warpOrder.threadCount),
        ]
      );
    }

    for (let i = 0; i < request.partialThreads.length; i++) {
      const partialThread = request.partialThreads[i];
      await queryDB(
        "INSERT INTO WarpPartialThreads(warpinfoid,colorvalue,colorlabel,threadcount,legendnumber) values($1,$2,$3,$4,$5)",
        [
          warpInfoId,
          partialThread.color,
          partialThread.colorName,
          partialThread.threadCount,
          partialThread.legendNumber,
        ]
      );
    }

    res.status(201).json({ message: "Design saved successfully", designId });
  } catch (error) {
    console.error("Error saving design:", error);
    res
      .status(500)
      .json({ error: "Failed to save design", details: error.message });
  }
});

app.post("/api/save-weft-design", async (req, res) => {
  try {
    const request = req.body;
    console.log("request", request);

    // Use provided designId if present, otherwise create new
    let designId = request.designId;
    if (!designId) {
      const queryDesigns = await queryDB(
        "INSERT into designsheet(designname) values($1) RETURNING id",
        [request.designName]
      );
      designId = queryDesigns.rows[0].id;
    }

    const designColorRelation = await queryDB(
      "INSERT INTO designcolorrelation(designid,colorname) values($1,$2) RETURNING id",
      [designId, request.colorName]
    );
    const designColorId = designColorRelation.rows[0].id;

    const queryWefts = await queryDB(
      "INSERT into designsheetweft(designid, designcolorid) values($1,$2) RETURNING id",
      [designId, designColorId]
    );
    const length = request.threadWeights.length - 1;

    const weftId = queryWefts.rows[0].id;

    const queryWeftInfo = await queryDB(
      `INSERT INTO weftinfo(weftid,colorname,weftcount,pick,wastage,totalquantity,width,
      totalthreads,weftweight,threadperrepeat,ordertotalweight,totalweightperrepeat) 
      values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) RETURNING id`,
      [
        weftId,
        request.colorName,
        request.wefts[0].count,
        request.wefts[0].picks,
        request.wefts[0].constant,
        request.totalOrderWidth,
        request.width,
        request.totalThreads,
        request.weftWeights[0],
        parseFloat(request.totalThreadSum),
        parseFloat(request.threadWeights[length].totalWeight),
        parseFloat(request.threadWeights[length].weight),
      ]
    );

    const weftInfoId = queryWeftInfo.rows[0].id;

    // Loop through thread weights but skip the last object
    for (let i = 0; i < request.threadWeights.length - 1; i++) {
      const threadWeight = request.threadWeights[i];
      await queryDB(
        "INSERT INTO weftcolorsinfo(weftinfoid,colorvalue,colorlabel,legend,threads,weight,totalweight,totalweightthreads) values($1,$2,$3,$4,$5,$6,$7,$8)",
        [
          weftInfoId,
          threadWeight.colorValue,
          threadWeight.color,
          threadWeight.legendNumber,
          threadWeight.singleRepeatThread,
          parseFloat(threadWeight.weight),
          parseFloat(threadWeight.totalWeight),
          threadWeight.threadCount,
        ]
      );
    }

    // for (let i = 0; i < request.WeftOrder.length; i++) {
    //   const weftOrder = request.WeftOrder[i];
    //   await queryDB(
    //     "INSERT INTO WaOrderColours(warpinfoid,colorvalue,colorlabel,threadcount) values($1,$2,$3,$4)",
    //     [
    //       warpInfoId,
    //       warpOrder.color.toLowerCase(),
    //       warpOrder.colorName,
    //       parseInt(warpOrder.threadCount),
    //     ]
    //   );
    // }

    // for (let i = 0; i < request.partialThreads.length; i++) {
    //   const partialThread = request.partialThreads[i];
    //   await queryDB(
    //     "INSERT INTO WarpPartialThreads(warpinfoid,colorvalue,colorlabel,threadcount,legendnumber) values($1,$2,$3,$4,$5)",
    //     [
    //       warpInfoId,
    //       partialThread.color,
    //       partialThread.colorName,
    //       partialThread.threadCount,
    //       partialThread.legendNumber,
    //     ]
    //   );
    // }

    res.status(201).json({ message: "Design saved successfully", designId });
  } catch (error) {
    console.error("Error saving weft design:", error);
    res
      .status(500)
      .json({ error: "Failed to save design", details: error.message });
  }
});

// Get designs with warps and wefts
app.get("/api/designswithdetails", async (req, res) => {
  try {
    // First get all designs
    const designsQuery = `
      SELECT id, designname 
      FROM designsheet 
      ORDER BY id DESC`;
    const designs = (await queryDB(designsQuery)).rows;

    // For each design, get warps and wefts
    const designsWithDetails = await Promise.all(
      designs.map(async (design) => {
        // Get warps
        const warpsQuery = `
        SELECT wi.*, dsw.id as warp_id
        FROM designsheetwarp dsw
        JOIN warpinfo wi ON wi.warpid = dsw.id
        WHERE dsw.designid = $1`;
        const warps = (await queryDB(warpsQuery, [design.id])).rows;

        // Get warp colors for each warp
        const warpsWithColors = await Promise.all(
          warps.map(async (warp) => {
            const colorsQuery = `
          SELECT *
          FROM warpcolorsinfo
          WHERE warpinfoid = $1`;
            const colors = (await queryDB(colorsQuery, [warp.id])).rows;
            return { ...warp, colors };
          })
        );

        // Get wefts
        const weftsQuery = `
        SELECT wi.*, dsw.id as weft_id
        FROM designsheetweft dsw
        JOIN weftinfo wi ON wi.weftid = dsw.id
        WHERE dsw.designid = $1`;
        const wefts = (await queryDB(weftsQuery, [design.id])).rows;

        // Get weft colors for each weft
        const weftsWithColors = await Promise.all(
          wefts.map(async (weft) => {
            const colorsQuery = `
          SELECT *
          FROM weftcolorsinfo
          WHERE weftinfoid = $1`;
            const colors = (await queryDB(colorsQuery, [weft.id])).rows;
            return { ...weft, colors };
          })
        );

        return {
          ...design,
          warps: warpsWithColors,
          wefts: weftsWithColors,
        };
      })
    );

    res.json(designsWithDetails);
  } catch (error) {
    console.error("Error fetching designs:", error);
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/getdesigndetails/:id", async (req, res) => {
  try {
    const designid = req.params.id;
    console.log("req.params:", req.params);
    console.log("typeof req.params.id:", typeof req.params.id);
    console.log("designid:", req.params.id);

    const designNameQuery = `
        SELECT designname
        FROM designsheet
        WHERE id = $1`;
    const designNameResult = await queryDB(designNameQuery, [designid]);
    if (designNameResult.rows.length === 0) {
      throw new Error(`Design with ID ${designid} not found`);
    }

    const WarpInfoQuery = await pool.query(
      `
      SELECT 
        *
      FROM designsheet d
      JOIN designsheetwarp dw ON dw.designid = d.id
      JOIN warpinfo wi ON wi.warpid = dw.id
      WHERE d.id = $1
    `,
      [designid]
    );
    if (WarpInfoQuery.rows.length === 0) {
      return res.status(404).json({ error: "No warp information found" });
    }

    const FinalValueQuery = await pool.query(
      `
      SELECT 
        wci.id AS warpcolorsinfo_id,
        wci.colorvalue,
        wci.colorlabel,
        wci.legend,
        wci.threads,
        wci.weight,
        wci.totalweight,
        wci.totalweightthreads,
        wci.percentage
      FROM designsheet d
      JOIN designsheetwarp dw ON dw.designid = d.id
      JOIN warpinfo w ON w.warpid = dw.id
      JOIN warpcolorsinfo wci ON wci.warpinfoid = w.id
      WHERE d.id = $1
    `,
      [designid]
    );

    if (FinalValueQuery.rows.length === 0) {
      return res.status(404).json({ error: "No design details found" });
    }

    const result = {
      finalvaluequery: FinalValueQuery.rows,
      warpquery: WarpInfoQuery.rows,
      designName: designNameResult.rows[0].designname,
    };
    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching design details:", error);
    res.status(500).json({ error: error.message });
  }
});

// Get design_status for a design
app.get("/api/design-status/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await queryDB(
      "SELECT design_status FROM designs WHERE design_id = $1",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Design not found" });
    }
    res.json({ design_status: result.rows[0].design_status });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update design_status for a design
app.put("/api/design-status/:id", async (req, res) => {
  const { id } = req.params;
  const { design_status } = req.body;
  const created_date = new Date().toISOString().split("T")[0];
  try {
    const result = await queryDB(
      "UPDATE designs SET design_status = $1, created_date = $2 WHERE design_id = $3 RETURNING design_status, created_date",
      [design_status, created_date, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Design not found" });
    }
    res.json({
      design_status: result.rows[0].design_status,
      created_date: result.rows[0].created_date,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
