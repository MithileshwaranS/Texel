import * as YarnModel from "../models/yarnModel.js";

export const getYarnCounts = async (req, res) => {
  try {
    const yarnCounts = await YarnModel.getAllYarn();
    res.json(yarnCounts);
  } catch (error) {
    console.error("Error fetching yarn counts:", error);
    res.status(500).json({ error: error.message });
  }
};

export const editYarn = async (req, res) => {
  try {
    const { id } = req.params;
    const { yarnCount, hanksWt, yarnPrice } = req.body;

    const updatedYarn = await YarnModel.updateYarn(id, {
      yarnCount,
      hanksWt,
      yarnPrice,
    });

    res.json({
      message: "Yarn updated successfully",
      updatedYarn,
    });
  } catch (err) {
    console.error("Update failed:", err);
    res.status(500).json({ message: "Update failed", error: err.message });
  }
};

export const getYarnPriceHistory = async (req, res) => {
  try {
    const yarnCount = decodeURIComponent(req.params.yarnCount);
    console.log("Fetching history for yarn count:", yarnCount); // decoding log
    const history = await YarnModel.getYarnPriceHistory(yarnCount);
    res.json(history);
  } catch (err) {
    console.error("Error fetching yarn price history:", err);
    res.status(500).json({
      message: "Error fetching yarn price history",
      error: err.message,
    });
  }
};

export const getYarnPrice = async (req, res) => {
  try {
    const yarnPrices = await YarnModel.getYarnPrice();
    res.json(yarnPrices);
  } catch (error) {
    console.error("Error fetching yarn prices:", error);
    res.status(500).json({ error: error.message });
  }
};

export const addYarn = async (req, res) => {
  try {
    const { yarnCount, hanksWt, yarnPrice } = req.body;

    const newYarn = await YarnModel.addNewYarn(yarnCount, hanksWt, yarnPrice);

    res.status(201).json({
      message: "New yarn added successfully",
      newYarn,
    });
  } catch (err) {
    console.error("Error adding new yarn:", err);
    res
      .status(500)
      .json({ message: "Error adding new yarn", error: err.message });
  }
};

export const deleteYarn = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedYarn = await YarnModel.deleteYarnById(id);

    if (deletedYarn.length === 0) {
      return res.status(404).json({ message: "Yarn not found" });
    }

    res.json({
      message: "Yarn deleted successfully",
      deletedYarn: deletedYarn[0],
    });
  } catch (err) {
    console.error("Error deleting yarn:", err);
    res
      .status(500)
      .json({ message: "Error deleting yarn", error: err.message });
  }
};
