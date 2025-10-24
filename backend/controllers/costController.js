import * as CostModel from "../models/costModel.js";

export const getAllCosts = async (req, res) => {
  try {
    const costs = await CostModel.getAllCosts();
    res.json(costs); // already rows
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET design by ID (including wefts and warps)
export const getCostById = async (req, res) => {
  const { id } = req.params;
  try {
    const data = await CostModel.getCostById(id);

    if (data.design.length === 0) {
      return res.status(404).json({ message: "Cost not found" });
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
