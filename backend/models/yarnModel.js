import { queryDB } from "../config/db.js";

export const getAllYarn = async () => {
  const res = await queryDB("SELECT yarn_count, hanks_wt FROM yarndetails");
  return res.rows;
};
