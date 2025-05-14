import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 3000;

// 1. Get all design details
app.get('/api/designdetails', async (req, res) => {
  const { data, error } = await supabase.from('designdetails').select('*');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// 2. Get a design detail by ID
app.get('/api/designdetails/:id', async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase
    .from('designdetails')
    .select('*')
    .eq('designno', id);
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// 3. Get yarn counts
app.get('/api/yarnCounts', async (req, res) => {
  const { data, error } = await supabase
    .from('yarndetails')
    .select('yarn_count, hanks_wt');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// 4. Get yarn prices
app.get('/api/yarnPrice', async (req, res) => {
  const { data, error } = await supabase
    .from('yarndetails')
    .select('yarn_count, yarnprice');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// 5. Edit/Update Yarn
app.put('/api/editYarn/:id', async (req, res) => {
  const { id } = req.params;
  const { yarnCount, hanksWt, yarnPrice } = req.body;
  const { data, error } = await supabase
    .from('yarndetails')
    .update({
      yarn_count: yarnCount,
      hanks_wt: hanksWt,
      yarnprice: yarnPrice,
    })
    .eq('id', id)
    .select();

  if (error) return res.status(500).json({ message: 'Update failed', error: error.message });
  res.json({ message: 'Yarn updated successfully', updatedYarn: data[0] });
});

// 6. Delete Yarn
app.delete('/api/deleteYarn/:id', async (req, res) => {
  const { id } = req.params;
  const { error } = await supabase.from('yarndetails').delete().eq('id', id);
  if (error) return res.status(500).json({ message: 'Delete failed', error: error.message });
  res.json({ message: 'Yarn deleted successfully' });
});

// 7. Add new yarn
app.post('/api/addYarn', async (req, res) => {
  const { yarnCount, hanksWt, yarnPrice } = req.body;
  const { data, error } = await supabase
    .from('yarndetails')
    .insert([
      { yarn_count: yarnCount, hanks_wt: hanksWt, yarnprice: yarnPrice }
    ])
    .select();
  if (error) return res.status(500).json({ error: 'Insertion failed', details: error.message });
  res.status(201).json(data[0]);
});

// 8. Get all yarn details
app.get('/api/yarnDetails', async (req, res) => {
  const { data, error } = await supabase
    .from('yarndetails')
    .select('yarn_count, hanks_wt, yarnprice, id');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// 9. Submit costing form
app.post('/api/submit', async (req, res) => {
  const body = req.body;

  const { data: existing, error: checkError } = await supabase
    .from('designdetails')
    .select('*')
    .eq('designname', body.designName);

  if (checkError) return res.status(500).json({ error: checkError.message });

  if (existing.length > 0) {
    return res.status(409).json({ message: 'Design name already exists!' });
  }

  const { error: insertError } = await supabase.from('designdetails').insert([
    {
      designname: body.designName,
      width: body.width,
      reed: body.reed,
      pick: body.pick,
      warpweight: body.warpweight,
      weftweight: body.weftweight,
      warpcost: body.warpCost,
      weftcost: body.weftCost,
      weavingcost: body.weaving,
      washingcost: body.washing,
      profit: body.profit,
      totalcost: body.totalCost,
      gst: body.gst,
      warpcount: body.warpCount,
      weftcount: body.weftCount,
      transportcost: body.transport,
      finaltotal: body.finaltotal,
      warpdyeing: body.warpDyeing,
      weftdyeing: body.weftDyeing,
      initweftcost: body.initWeftCost,
      initwarpcost: body.initWarpCost,
      mendingcost: body.mending,
      twistingcost: body.twisting,
      created_date: body.designDate,
      profitpercent: body.profitPercent,
    }
  ]);

  if (insertError) {
    return res.status(500).json({ message: 'Insert failed', error: insertError.message });
  }

  res.status(200).json({ message: 'Design inserted successfully' });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
