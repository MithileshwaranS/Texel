import pool from "./db.js";
import express from "express";
import cors from "cors";

const app = express();

//middle ware 
app.use(cors());
app.use(express.json());



app.get('/api/yarnCounts', async(req,res)=>{
    try {
        const yarnCounts = await pool.query("Select * from YarnCount");
        res.json(yarnCounts.rows)
        
    } catch (error) {
        console.error(error.message)
        
    }

    console.log(yarnCounts.rows)
})


app.listen(3000,()=>{
    console.log("Server is up and running");
});