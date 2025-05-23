import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { Pool } from "pg";
import fetch from "node-fetch";
import { v2 as cloudinary } from "cloudinary";
import ExcelJS from "exceljs";

dotenv.config();

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const pool = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
  // ssl: {
  //   rejectUnauthorized: false,
  // },
});

pool
  .query("SELECT NOW()")
  .then((res) => {
    console.log("✅ DB Connected at:", res.rows[0].now);
  })
  .catch((err) => {
    console.error("❌ DB Connection Error:", err);
  });

const app = express();

app.use(cors());
app.use(express.json());

const port = process.env.PORT || 3000;

setInterval(() => {
  fetch(`${process.env.BACKEND_URL}/ping`)
    .then((res) => console.log(`Self-ping status: ${res.status}`))
    .catch((err) => console.error("Ping failed:", err));
}, 1000 * 60 * 14); // every 14 minutes

// Helper function to query
async function queryDB(text, params) {
  const client = await pool.connect();
  try {
    const res = await client.query(text, params);
    return res;
  } finally {
    client.release();
  }
}

// 1. Get all design details
app.get("/api/designdetails", async (req, res) => {
  try {
    const result = await queryDB("SELECT * FROM designs");
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 2. Get design detail by ID (including wefts and warps)
app.get("/api/designdetails/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const designRes = await queryDB(
      "SELECT * FROM designs WHERE design_id = $1",
      [id]
    );
    const weftsRes = await queryDB(
      "SELECT * FROM wefts WHERE design_id = $1 ORDER BY weft_id ASC",
      [id]
    );
    const warpsRes = await queryDB(
      "SELECT * FROM warps WHERE design_id = $1 ORDER BY warp_id ASC",
      [id]
    );

    if (designRes.rows.length === 0) {
      return res.status(404).json({ message: "Design not found" });
    }

    res.json({
      design: designRes.rows,
      wefts: weftsRes.rows,
      warps: warpsRes.rows,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

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

// 5. Edit/Update Yarn
app.put("/api/editYarn/:id", async (req, res) => {
  const { id } = req.params;
  const { yarnCount, hanksWt, yarnPrice } = req.body;

  try {
    const result = await queryDB(
      `UPDATE yarndetails SET yarn_count=$1, hanks_wt=$2, yarnprice=$3 WHERE id=$4 RETURNING *`,
      [yarnCount, hanksWt, yarnPrice, id]
    );

    if (result.rows.length === 0)
      return res.status(404).json({ message: "Yarn not found" });

    res.json({
      message: "Yarn updated successfully",
      updatedYarn: result.rows[0],
    });
  } catch (error) {
    res.status(500).json({ message: "Update failed", error: error.message });
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
        `INSERT INTO warps (design_id, warpcount, warpweight, initwarpcost, warpdyeing, reed)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [
          designId,
          warp.count,
          warpWeight,
          warp.cost,
          warp.dyeing,
          parseFloat(warp.reed),
        ]
      );
    }

    // Insert wefts
    for (let i = 0; i < body.wefts.length; i++) {
      const weft = body.wefts[i];
      const weftWeight = parseFloat(body.weftWeights[i]);

      await queryDB(
        `INSERT INTO wefts (design_id, weftcount, weftweight, initweftcost, weftdyeing, pick)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [
          designId,
          weft.count,
          weftWeight,
          weft.cost,
          weft.dyeing,
          parseFloat(weft.pick),
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

//Login api
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const query = await pool.query("SELECT * FROM login WHERE email = $1", [
      email,
    ]);

    if (query.rows.length === 0) {
      return res.status(401).json({ error: "User not found" });
    }

    const user = query.rows[0];
    if (user.password !== password) {
      return res.status(401).json({ error: "Invalid password" });
    }

    res.json({ message: "login successful", userId: user.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

//excel generation

// Excel download route
app.get("/api/excel", async (req, res) => {
  try {
    const resultDesigns = await pool.query("SELECT * FROM designs");
    const designs = resultDesigns.rows;
    const resultWarps = await pool.query("SELECT * FROM warps");
    const warps = resultWarps.rows;
    const resultWefts = await pool.query("SELECT * FROM wefts");
    const wefts = resultWefts.rows;

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Design Report");

    worksheet.columns = [
      { header: "Design ID", key: "design_id" },
      { header: "Design Name", key: "designname" },
      { header: "Width", key: "width" },
      { header: "Warp Count", key: "warpcount" },
      { header: "Weft Count", key: "weftcount" },
      { header: "Reed", key: "reed" },
      { header: "Pick", key: "pick" },
      { header: "initWarpCost", key: "initwarpcost" },
      { header: "initWeftCost", key: "initweftcost" },
      { header: "Warp Dyeing", key: "warpdyeing" },
      { header: "Weft Dyeing", key: "weftdyeing" },
      { header: "Warp Wt", key: "warpweight" },
      { header: "Weft Wt", key: "weftweight" },
      { header: "Warp Cost", key: "warpcost" },
      { header: "Weft Cost", key: "weftcost" },
      { header: "Weaving", key: "weavingcost" },
      { header: "Mending", key: "mendingcost" },
      { header: "Washing", key: "washingcost" },
      { header: "Transport", key: "transportcost" },
      { header: "Profit ", key: "profit" },
      { header: "Subtotal", key: "subtotal" },
      { header: "GST", key: "gst" },
      { header: "Final Total", key: "finaltotal" },
    ];

    designs.forEach((design) => {
      const relatedWarps = warps.filter(
        (w) => w.design_id === design.design_id
      );
      const relatedWefts = wefts.filter(
        (w) => w.design_id === design.design_id
      );

      for (const warp of relatedWarps) {
        for (const weft of relatedWefts) {
          worksheet.addRow({
            design_id: design.design_id,
            designname: design.designname,
            width: design.width,
            warpcount: warp.warpcount,
            weftcount: weft.weftcount,
            reed: warp.reed,
            pick: weft.pick,
            initwarpcost: warp.initwarpcost,
            initweftcost: weft.initweftcost,
            warpdyeing: warp.warpdyeing,
            weftdyeing: weft.weftdyeing,
            warpweight: warp.warpweight,
            weftweight: weft.weftweight,
            warpcost: design.warpcost,
            weftcost: design.weftcost,
            weavingcost: design.weavingcost,
            mendingcost: design.mendingcost,
            washingcost: design.washingcost,
            transportcost: design.transportcost,
            profit: design.profit,
            subtotal: design.subtotal,
            gst: design.gst,
            finaltotal: design.finaltotal,
          });
        }
      }
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

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
