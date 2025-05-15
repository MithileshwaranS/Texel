import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pkg from "pg";

dotenv.config();
const { Pool } = pkg;

const pool = new Pool({
  host: process.env.PG_HOST,
  port: process.env.PG_PORT,
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  database: process.env.PG_DATABASE,
});

const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 3000;

// 1. Get all design details
app.get("/api/designdetails", async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM designs");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. Get a design detail by ID
app.get("/api/designdetails/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const { rows } = await pool.query(
      "SELECT * FROM designs WHERE design_id = $1",
      [id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. Get yarn counts
app.get("/api/yarnCounts", async (req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT yarn_count, hanks_wt FROM yarndetails"
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4. Get yarn prices
app.get("/api/yarnPrice", async (req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT yarn_count, yarnprice FROM yarndetails"
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 5. Edit/Update Yarn
app.put("/api/editYarn/:id", async (req, res) => {
  const { id } = req.params;
  const { yarnCount, hanksWt, yarnPrice } = req.body;
  try {
    const { rows } = await pool.query(
      "UPDATE yarndetails SET yarn_count = $1, hanks_wt = $2, yarnprice = $3 WHERE id = $4 RETURNING *",
      [yarnCount, hanksWt, yarnPrice, id]
    );
    res.json({ message: "Yarn updated successfully", updatedYarn: rows[0] });
  } catch (err) {
    res.status(500).json({ message: "Update failed", error: err.message });
  }
});

// 6. Delete Yarn
app.delete("/api/deleteYarn/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM yarndetails WHERE id = $1", [id]);
    res.json({ message: "Yarn deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed", error: err.message });
  }
});

// 7. Add new yarn
app.post("/api/addYarn", async (req, res) => {
  const { yarnCount, hanksWt, yarnPrice } = req.body;
  try {
    const { rows } = await pool.query(
      "INSERT INTO yarndetails (yarn_count, hanks_wt, yarnprice) VALUES ($1, $2, $3) RETURNING *",
      [yarnCount, hanksWt, yarnPrice]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Insertion failed", details: err.message });
  }
});

// 8. Get all yarn details
app.get("/api/yarnDetails", async (req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT yarn_count, hanks_wt, yarnprice, id FROM yarndetails"
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 9. Submit costing form
app.post("/api/submit", async (req, res) => {
  const body = req.body;
  try {
    const { rows: existing } = await pool.query(
      "SELECT * FROM designs WHERE designname = $1",
      [body.designName]
    );

    if (existing.length > 0) {
      return res.status(409).json({ message: "Design name already exists!" });
    }

    const insertQuery = `
      INSERT INTO designs (
        designname,created_date,profitpercent,weavingcost
        , washingcost, mendingcost, transportcost,gst, width,warpcost,weftcost
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10,$11
      )
    `;

    const insertQueryWarp = `
    INSERT INTO warps (
        design_id,warpcount,warpweight
        , initwarpcost, warpdyeing,reed
      ) VALUES (
        $1, $2, $3, $4, $5, $6
      )
    `;
    const insertQueryWeft = `
    INSERT INTO wefts (
        design_id,weftcount,weftweight
        , initweftcost, weftdyeing,pick
      ) VALUES (
        $1, $2, $3, $4, $5, $6
      )
    `;

    const values = [
      body.designName,
      body.designDate,
      body.profitPercent,
      body.weaving,
      body.washing,
      body.mending,
      body.transport,
      body.gst,
      body.width,
      parseFloat(body.warpCost),
      parseFloat(body.weftCost),
    ];
    await pool.query(insertQuery, values);
    const { rows: designRows } = await pool.query(
      "SELECT design_id from designs where designname = $1",
      [body.designName]
    );
    const designId = designRows[0].design_id;
    console.log(designId);
    //Warp Insertions
    for (let i = 0; i < body.warps.length; i++) {
      const warp = body.warps[i];
      const warpWeight = parseFloat(body.warpWeights[i]);

      await pool.query(insertQueryWarp, [
        designId,
        warp.count,
        warpWeight,
        warp.cost,
        warp.dyeing,
        parseFloat(warp.reed),
      ]);
      console.log("warp", i);
      console.log(
        designId,
        warp.count,
        warpWeight,
        warp.cost,
        warp.dyeing,
        warp.reed
      );
    }
    //Weft insertion
    for (let i = 0; i < body.wefts.length; i++) {
      const wefts = body.wefts[i];
      const weftWeight = parseFloat(body.weftWeights[i]);

      await pool.query(insertQueryWeft, [
        designId,
        wefts.count,
        weftWeight,
        wefts.cost,
        wefts.dyeing,
        parseFloat(wefts.pick),
      ]);
      // console.log("warp", i);
      // console.log(
      //   designId,
      //   warp.count,
      //   warpWeight,
      //   warp.cost,
      //   warp.dyeing,
      //   warp.reed
      // );
    }
    res.status(200).json({ message: "Design inserted successfully" });
  } catch (err) {
    console.error("error messgae", err);
    res.status(500).json({ message: "Insert failed", error: err.message });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
