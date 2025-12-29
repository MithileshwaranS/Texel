import { queryDB } from "../config/db.js";

export const findDesignReqByName = async (designName) => {
  return await queryDB("SELECT * FROM design_sampling WHERE design_name = $1", [
    designName,
  ]);
};

export const insertDesign = async ({
  designName,
  designImage,
  status,
  designImagePublicId,
  designDate,
}) => {
  return await queryDB(
    `INSERT INTO design_sampling 
     (design_name, designimage_url, status, designImagePublicId, created_at)
     VALUES ($1, $2, $3, $4, $5)`,
    [designName, designImage, status, designImagePublicId, designDate]
  );
};

export const getAllDesignReqs = async () => {
  return await queryDB("SELECT * FROM design_sampling");
};

export const getDesignbyId = async (designId) => {
  return await queryDB("SELECT * FROM design_sampling WHERE designid = $1", [
    designId,
  ]);
};

export const deleteSampling = async (designId) => {
  return await queryDB("DELETE FROM design_sampling WHERE designid = $1", [
    designId,
  ]);
};
