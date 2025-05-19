import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { Pool } from "pg";
import fetch from "node-fetch";
import { v2 as cloudinary } from "cloudinary";

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
        transportcost, gst, width, warpcost, weftcost, designimage, designImagePublicId, subtotal, finaltotal, profit
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16) RETURNING design_id`,
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

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
