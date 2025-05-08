import pkg from "pg";
import dotenv from "dotenv";
const { Client } = pkg;

dotenv.config();

const client = new Client({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: process.env.PG_PORT,
});

try {
    await client.connect();
    console.log("db connected successfully")
} catch (err) {
    console.error("Connection error",err.stack);
}

export default client;