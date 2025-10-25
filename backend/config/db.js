import { Pool } from "pg";
import "dotenv/config";

export const pool = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});

pool
  .query("SELECT NOW()")
  .then((res) => {
    console.log("✅ DB Connected at:", res.rows[0].now);
  })
  .catch((err) => {
    console.error("❌ DB Connection Error:", err);
  });

export async function queryDB(text, params) {
  const client = await pool.connect();
  try {
    const res = await client.query(text, params);
    return res;
  } finally {
    client.release();
  }
}

export default pool;
