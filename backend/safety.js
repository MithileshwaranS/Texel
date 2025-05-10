import pool from "./db.js";
import express from "express";
import cors from "cors";
import supabase from "./db.js";

const app = express();

//middle ware 
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 3000;


//displaying the yarncounts in the dropdownmenu
app.get('/api/yarnCounts', async(req,res)=>{
    try {
        const yarnCounts = await pool.query("Select * from YarnCount");
        res.json(yarnCounts.rows)
        
    } catch (error) {
        console.error(error.message)
        
    }

    
})

//submiting the costing

app.post('/api/submit',async(req,res)=>{
    try {
        const {
            designName,
            
            width,
            reed,
            pick,
            warpweight,
            weftweight,
            warpCount,
            weftCount,
            warpCost,
            weftCost,
            warpDyeing,
            weftDyeing,
            initWeftCost,
            initWarpCost,
            weaving,
            washing,
            profit,
            totalCost,
            saveprofit,
            gst,
            transport,
            finaltotal,
            
            } = req.body;

            const existing = await pool.query(
      'SELECT * FROM designdetails WHERE designname = $1',
      [designName]
    );

    if (existing.rows.length > 0) {
      return res.status(409).json({ message: 'Design name already exists!' });
    }

    

        const newDesign = await pool.query(
            `INSERT INTO designdetails (
                designname,
                width,
                reed,
                pick,
                warpweight,
                weftweight,
                warpcost,
                weftcost,
                weavingcost,
                washingcost,
                profit,
                totalcost,
                gst,
                warpcount,
                weftcount,
                transportcost,
                finaltotal,
                warpdyeing,
                weftdyeing,
                initweftcost,
                initwarpcost
            ) VALUES (
                $1, $2, $3, $4, $5, $6, $7, $8, $9, $10,
                $11, $12, $13, $14, $15, $16, $17, $18, $19, $20,$21
            ) RETURNING *`,
            [
                designName,
                width,
                reed,
                pick,
                warpweight,
                weftweight,
                warpCost,
                weftCost,
                weaving,
                washing,
                profit,
                totalCost,
                gst,
                warpCount,
                weftCount,
                transport,
                finaltotal,
                warpDyeing,
                weftDyeing,
                initWeftCost,
                initWarpCost
            ]
            );
    
        console.log("Submitted succesfully");
        

        res.status(200).json({ message: "Design inserted successfully" });
        

        
    } catch (error) {
        console.error("Insert error:", error.message);
    res.status(500).json({ message: "Server error while inserting design" });
        
    }
})



app.listen(3000,()=>{
    console.log("Server is up and running");
});


// import { supabase } from "./db.js"; // ✅ import Supabase client
// import express from "express";
// import cors from "cors";

// const app = express();

// app.use(cors());
// app.use(express.json());

// const port = process.env.PORT || 4000;

// // ✅ Minimal Supabase test route
// app.get('/api/check-supabase', async (req, res) => {
//   try {
//     const { data, error } = await supabase.from('test_table').select('*').limit(1); // Replace 'test_table' with any real table in your Supabase
//     if (error) throw error;
//     res.status(200).json({ message: "✅ Supabase is connected", sample: data });
//   } catch (err) {
//     res.status(500).json({ message: "❌ Supabase connection failed", error: err.message });
//   }
// });

// app.listen(3000, () => {
//   console.log("Server is up and running");
// });

// import express from "express";
// import cors from "cors";
// import supabase from "./db.js"; // Supabase client

// const app = express();

// // Middleware
// app.use(cors());
// app.use(express.json());

// const port = process.env.PORT || 3000;

// // GET: Fetch yarn counts for dropdown
// app.get('/api/yarnCounts', async (req, res) => {
//   try {
//     const { data, error } = await supabase.from('YarnCount').select('*');
//     if (error) throw error;
//     res.json(data);
//   } catch (error) {
//     console.error("Fetch error:", error.message);
//     res.status(500).json({ message: "Failed to fetch yarn counts" });
//   }
// });

// // POST: Submit costing
// app.post('/api/submit', async (req, res) => {
//   try {
//     const {
//       designName,
//       width, reed, pick,
//       warpweight, weftweight,
//       warpCount, weftCount,
//       warpCost, weftCost,
//       warpDyeing, weftDyeing,
//       initWeftCost, initWarpCost,
//       weaving, washing,
//       profit, totalCost, saveprofit,
//       gst, transport, finaltotal
//     } = req.body;

//     // Check if design name already exists
//     const { data: existing, error: selectError } = await supabase
//       .from('designdetails')
//       .select('designname')
//       .eq('designname', designName);

//     if (selectError) throw selectError;

//     if (existing.length > 0) {
//       return res.status(409).json({ message: 'Design name already exists!' });
//     }

//     // Insert new design
//     const { error: insertError } = await supabase
//       .from('designdetails')
//       .insert([{
//         designname: designName,
//         width,
//         reed,
//         pick,
//         warpweight,
//         weftweight,
//         warpcost: warpCost,
//         weftcost: weftCost,
//         weavingcost: weaving,
//         washingcost: washing,
//         profit,
//         totalcost: totalCost,
//         gst,
//         warpcount: warpCount,
//         weftcount: weftCount,
//         transportcost: transport,
//         finaltotal,
//         warpdyeing: warpDyeing,
//         weftdyeing: weftDyeing,
//         initweftcost: initWeftCost,
//         initwarpcost: initWarpCost
//       }]);

//     if (insertError) throw insertError;

//     console.log("Submitted successfully");
//     res.status(200).json({ message: "Design inserted successfully" });

//   } catch (error) {
//     console.error("Insert error:", error.message);
//     res.status(500).json({ message: "Server error while inserting design" });
//   }
// });

// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });

