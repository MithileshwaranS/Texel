import * as YarnModel from "../models/yarnModel.js";

export const getYarnCounts = async (req, res) => {
  try {
    const yarnCounts = await YarnModel.getYarnCounts();
    res.json(yarnCounts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
