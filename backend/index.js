import pool from "./db.js";
import express from "express";
import cors from "cors";

const app = express();

app.listen(3000,()=>{
    console.log("Server is up and running");
});