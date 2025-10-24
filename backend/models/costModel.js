import { queryDB } from "../config/db.js";

export const getAllCosts = async () => {
  const res = await queryDB("SELECT * FROM designs");
  return res.rows;
};

export const getCostById = async (id) => {
  const costRes = await queryDB("SELECT * FROM designs WHERE design_id = $1", [
    id,
  ]);
  const weftsRes = await queryDB(
    "SELECT * FROM wefts WHERE design_id = $1 ORDER BY weft_id ASC",
    [id]
  );
  const warpsRes = await queryDB(
    "SELECT * FROM warps WHERE design_id = $1 ORDER BY warp_id ASC",
    [id]
  );

  return {
    design: costRes.rows,
    wefts: weftsRes.rows,
    warps: warpsRes.rows,
  };
};
