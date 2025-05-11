import pool from "./db.js";
import express from "express";
import cors from "cors";

const app = express();

//middle ware 
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 3000;


//displaying the yarncounts in the dropdownmenu
app.get('/api/yarnCounts', async(req,res)=>{
    try {
        const yarnCounts = await pool.query("Select yarn_count,hanks_wt from yarnDetails");
        res.json(yarnCounts.rows)
        
    } catch (error) {
        console.error(error.message)
        
    }

    
})

//mapping the yarn price respectively
app.get('/api/yarnPrice',async(req,res)=>{
  try {
    const yarnPrice = await pool.query("Select yarn_count,yarnprice from yarnDetails")
    res.json(yarnPrice.rows)
    
  } catch (error) {
    console.error(error.message);
    
  }
})

// Edit/Update Yarn Price
app.put('/api/editYarn/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { yarnCount, hanksWt, yarnPrice } = req.body;

    const updateYarn = await pool.query(
      "UPDATE yarnDetails SET yarn_count = $1, hanks_wt = $2, yarnprice = $3 WHERE id = $4 RETURNING *",
      [yarnCount, hanksWt, yarnPrice, id]
    );

    res.json({
      message: 'Yarn updated successfully',
      updatedYarn: updateYarn.rows[0]
    });

  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error while updating yarn' });
  }
});


// Delete Yarn
app.delete('/api/deleteYarn/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // First check if the record exists
    const checkYarn = await pool.query(
      "SELECT * FROM yarnDetails WHERE id = $1",
      [id]
    );

    if (checkYarn.rows.length === 0) {
      return res.status(404).json({ message: 'Yarn record not found' });
    }

    // Delete the record
    await pool.query(
      "DELETE FROM yarnDetails WHERE id = $1",
      [id]
    );

    res.json({ message: 'Yarn deleted successfully' });

  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error while deleting yarn' });
  }
});


//adding new yarndetails 
app.post('/api/addYarn',async(req,res)=>{
    const {yarnCount,hanksWt,yarnPrice} = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO yarndetails (yarn_count, hanks_wt, yarnprice) VALUES ($1, $2, $3) RETURNING *',
      [yarnCount,hanksWt,yarnPrice]
    );
     res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error.message)
    res.status(500).json({ error: 'Database insertion failed' });
    
  }
})

//getting all the yarndetails

app.get('/api/yarnDetails',async(req,res)=>{
  try {
    const yarnDet = await pool.query("SELECT * from yarnDetails")
    res.json(yarnDet.rows)
    
  } catch (error) {
    console.error(error.message);
    
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