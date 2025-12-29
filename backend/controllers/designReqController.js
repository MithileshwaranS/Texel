import {
  findDesignReqByName,
  insertDesign,
  getAllDesignReqs,
  getDesignbyId,
} from "../models/designReqModel.js";

export const createDesignReq = async (req, res) => {
  try {
    const { designName, designImage, designDate, designImagePublicId } =
      req.body;
    const existingRes = await findDesignReqByName(designName);

    if (existingRes.rows.length > 0) {
      return res.status(400).json({ message: "Design name already exists" });
    }
    const status = "pending";

    await insertDesign({
      designName,
      designImage,
      status,
      designImagePublicId,
      designDate,
    });

    return res
      .status(201)
      .json({ message: "Design request created successfully" });
  } catch (error) {
    console.error("Error creating design request:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getDesignReqs = async (req, res) => {
  try {
    const designReqsRes = await getAllDesignReqs();
    return res.status(200).json(designReqsRes.rows);
  } catch (error) {
    console.error("Error fetching design requests:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getDesignReqById = async (req, res) => {
  try {
    const { id } = req.params;
    const designRes = await getDesignbyId(id);

    return res.status(200).json(designRes.rows);
  } catch (error) {
    console.error("Error fetching design request by ID:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
