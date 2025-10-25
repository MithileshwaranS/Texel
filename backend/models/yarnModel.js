import { queryDB, pool } from "../config/db.js";

export const getAllYarn = async () => {
  const res = await queryDB(
    "SELECT yarn_count, hanks_wt,yarnprice,id FROM yarndetails"
  );
  return res.rows;
};

export const getYarnById = async (id) => {
  const res = await queryDB(
    "SELECT yarn_count, hanks_wt, yarnprice FROM yarndetails WHERE id = $1",
    [id]
  );
  return res.rows[0];
};

export const updateYarn = async (id, { yarnCount, hanksWt, yarnPrice }) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const currentYarn = await getYarnById(id);

    const updateRes = await client.query(
      `UPDATE yarndetails 
       SET yarn_count=$1, hanks_wt=$2, yarnprice=$3 
       WHERE id=$4 
       RETURNING *`,
      [yarnCount, hanksWt, yarnPrice, id]
    );

    if (currentYarn && currentYarn.yarnprice !== yarnPrice) {
      await client.query(
        `INSERT INTO yarn_price_history (yarn_count, price, updated_by)
         VALUES ($1, $2, $3)`,
        [yarnCount, yarnPrice, "system"]
      );
    }

    await client.query("COMMIT");

    return updateRes.rows[0];
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
};

export const getYarnPriceHistory = async (yarnCount) => {
  const result = await pool.query(
    `SELECT price, created_at, updated_by 
       FROM yarn_price_history 
       WHERE yarn_count = $1 
       ORDER BY created_at DESC`,
    [yarnCount]
  );
  return result.rows;
};

export const getYarnPrice = async () => {
  const res = await queryDB("SELECT yarn_count, yarnprice FROM yarndetails");
  return res.rows;
};

export const addNewYarn = async (yarnCount, hanksWt, yarnPrice) => {
  const res = await queryDB(
    `INSERT INTO yarndetails (yarn_count, hanks_wt, yarnprice) 
     VALUES ($1, $2, $3) 
     RETURNING *`,
    [yarnCount, hanksWt, yarnPrice]
  );
  return res.rows[0];
};

export const deleteYarnById = async (id) => {
  const res = await queryDB(
    "DELETE FROM yarndetails WHERE id = $1 RETURNING *",
    [id]
  );
  return res.rows;
};
