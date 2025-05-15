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
app.get('/api/designdetails', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM designdetails');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. Get a design detail by ID
app.get('/api/designdetails/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const { rows } = await pool.query('SELECT * FROM designdetails WHERE designno = $1', [id]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. Get yarn counts
app.get('/api/yarnCounts', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT yarn_count, hanks_wt FROM yarndetails');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4. Get yarn prices
app.get('/api/yarnPrice', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT yarn_count, yarnprice FROM yarndetails');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 5. Edit/Update Yarn
app.put('/api/editYarn/:id', async (req, res) => {
  const { id } = req.params;
  const { yarnCount, hanksWt, yarnPrice } = req.body;
  try {
    const { rows } = await pool.query(
      'UPDATE yarndetails SET yarn_count = $1, hanks_wt = $2, yarnprice = $3 WHERE id = $4 RETURNING *',
      [yarnCount, hanksWt, yarnPrice, id]
    );
    res.json({ message: 'Yarn updated successfully', updatedYarn: rows[0] });
  } catch (err) {
    res.status(500).json({ message: 'Update failed', error: err.message });
  }
});

// 6. Delete Yarn
app.delete('/api/deleteYarn/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM yarndetails WHERE id = $1', [id]);
    res.json({ message: 'Yarn deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Delete failed', error: err.message });
  }
});

// 7. Add new yarn
app.post('/api/addYarn', async (req, res) => {
  const { yarnCount, hanksWt, yarnPrice } = req.body;
  try {
    const { rows } = await pool.query(
      'INSERT INTO yarndetails (yarn_count, hanks_wt, yarnprice) VALUES ($1, $2, $3) RETURNING *',
      [yarnCount, hanksWt, yarnPrice]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Insertion failed', details: err.message });
  }
});

// 8. Get all yarn details
app.get('/api/yarnDetails', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT yarn_count, hanks_wt, yarnprice, id FROM yarndetails');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 9. Submit costing form
app.post('/api/submit', async (req, res) => {
  const body = req.body;
  try {
    const { rows: existing } = await pool.query(
      'SELECT * FROM designdetails WHERE designname = $1',
      [body.designName]
    );

    if (existing.length > 0) {
      return res.status(409).json({ message: 'Design name already exists!' });
    }

    const insertQuery = `
      INSERT INTO designdetails (
        designname, width, reed, pick, warpweight, weftweight,
        warpcost, weftcost, weavingcost, washingcost, profit, totalcost,
        gst, warpcount, weftcount, transportcost, finaltotal, warpdyeing,
        weftdyeing, initweftcost, initwarpcost, mendingcost, twistingcost,
        created_date, profitpercent
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12,
        $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25
      )
    `;

    const values = [
      body.designName, body.width, body.reed, body.pick, body.warpweight, body.weftweight,
      body.warpCost, body.weftCost, body.weaving, body.washing, body.profit, body.totalCost,
      body.gst, body.warpCount, body.weftCount, body.transport, body.finaltotal, body.warpDyeing,
      body.weftDyeing, body.initWeftCost, body.initWarpCost, body.mending, body.twisting,
      body.designDate, body.profitPercent
    ];

    await pool.query(insertQuery, values);
    res.status(200).json({ message: 'Design inserted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Insert failed', error: err.message });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
