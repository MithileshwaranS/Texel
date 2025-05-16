import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 3000;

// 1. Get all design details
app.get("/api/designdetails", async (req, res) => {
  const { data, error } = await supabase.from("designs").select("*");
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// 2. Get design detail by ID
app.get("/api/designdetails/:id", async (req, res) => {
  const { id } = req.params;

  const [design, wefts, warps] = await Promise.all([
    supabase.from("designs").select("*").eq("design_id", id),
    supabase
      .from("wefts")
      .select("*")
      .eq("design_id", id)
      .order("weft_id", { ascending: true }),
    supabase
      .from("warps")
      .select("*")
      .eq("design_id", id)
      .order("warp_id", { ascending: true }),
  ]);

  if (design.error || wefts.error || warps.error) {
    return res.status(500).json({
      error:
        design.error?.message || wefts.error?.message || warps.error?.message,
    });
  }

  if (!design.data.length)
    return res.status(404).json({ message: "Design not found" });

  res.json({
    design: design.data,
    wefts: wefts.data,
    warps: warps.data,
  });
});

// 3. Get yarn counts
app.get("/api/yarnCounts", async (req, res) => {
  const { data, error } = await supabase
    .from("yarndetails")
    .select("yarn_count, hanks_wt");
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// 4. Get yarn prices
app.get("/api/yarnPrice", async (req, res) => {
  const { data, error } = await supabase
    .from("yarndetails")
    .select("yarn_count, yarnprice");
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// 5. Edit/Update Yarn
app.put("/api/editYarn/:id", async (req, res) => {
  const { id } = req.params;
  const { yarnCount, hanksWt, yarnPrice } = req.body;

  const { data, error } = await supabase
    .from("yarndetails")
    .update({
      yarn_count: yarnCount,
      hanks_wt: hanksWt,
      yarnprice: yarnPrice,
    })
    .eq("id", id)
    .select();

  if (error)
    return res
      .status(500)
      .json({ message: "Update failed", error: error.message });

  res.json({ message: "Yarn updated successfully", updatedYarn: data[0] });
});

// 6. Delete Yarn
app.delete("/api/deleteYarn/:id", async (req, res) => {
  const { id } = req.params;

  const { error } = await supabase.from("yarndetails").delete().eq("id", id);
  if (error)
    return res
      .status(500)
      .json({ message: "Delete failed", error: error.message });

  res.json({ message: "Yarn deleted successfully" });
});

// 7. Add new yarn
app.post("/api/addYarn", async (req, res) => {
  const { yarnCount, hanksWt, yarnPrice } = req.body;

  const { data, error } = await supabase
    .from("yarndetails")
    .insert({ yarn_count: yarnCount, hanks_wt: hanksWt, yarnprice: yarnPrice })
    .select();

  if (error)
    return res
      .status(500)
      .json({ error: "Insertion failed", details: error.message });

  res.status(201).json(data[0]);
});

// 8. Get all yarn details
app.get("/api/yarnDetails", async (req, res) => {
  const { data, error } = await supabase
    .from("yarndetails")
    .select("yarn_count, hanks_wt, yarnprice, id");
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// 9. Submit costing form
app.post("/api/submit", async (req, res) => {
  const body = req.body;

  try {
    const { data: existing, error: checkError } = await supabase
      .from("designs")
      .select("*")
      .eq("designname", body.designName);

    if (checkError) throw checkError;
    if (existing.length > 0) {
      return res.status(409).json({ message: "Design name already exists!" });
    }

    const { data: designData, error: insertDesignErr } = await supabase
      .from("designs")
      .insert({
        designname: body.designName,
        created_date: new Date(body.designDate.split("/").reverse().join("/"))
          .toISOString()
          .split("T")[0],

        profitpercent: body.profitPercent,
        weavingcost: body.weaving,
        washingcost: body.washing,
        mendingcost: body.mending,
        transportcost: body.transport,
        gst: body.gst,
        width: body.width,
        warpcost: parseFloat(body.warpCost),
        weftcost: parseFloat(body.weftCost),
        designimage: body.designImage,
        subtotal: body.totalCost,
        finaltotal: body.finaltotal,
        profit: body.profit,
      })
      .select("design_id");

    if (insertDesignErr) throw insertDesignErr;

    const designId = designData[0].design_id;

    // Insert warps
    for (let i = 0; i < body.warps.length; i++) {
      const warp = body.warps[i];
      const warpWeight = parseFloat(body.warpWeights[i]);

      const { error } = await supabase.from("warps").insert({
        design_id: designId,
        warpcount: warp.count,
        warpweight: warpWeight,
        initwarpcost: warp.cost,
        warpdyeing: warp.dyeing,
        reed: parseFloat(warp.reed),
      });

      if (error) throw error;
    }

    // Insert wefts
    for (let i = 0; i < body.wefts.length; i++) {
      const weft = body.wefts[i];
      const weftWeight = parseFloat(body.weftWeights[i]);

      const { error } = await supabase.from("wefts").insert({
        design_id: designId,
        weftcount: weft.count,
        weftweight: weftWeight,
        initweftcost: weft.cost,
        weftdyeing: weft.dyeing,
        pick: parseFloat(weft.pick),
      });

      if (error) throw error;
    }

    res.status(200).json({ message: "Design inserted successfully" });
  } catch (err) {
    console.error("Server Error:", err);
    res.status(500).json({ message: "Insert failed", error: err.message });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
