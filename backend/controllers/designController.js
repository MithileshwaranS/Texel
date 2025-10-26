// controllers/designController.js
import {
  findDesignByName,
  insertDesign,
  insertWarp,
  insertWeft,
} from "../models/designModel.js";

function parseDateToISO(dateStrDDMMYYYY) {
  if (!dateStrDDMMYYYY) return null;
  return new Date(dateStrDDMMYYYY.split("/").reverse().join("-"))
    .toISOString()
    .split("T")[0];
}

export const submitDesign = async (req, res) => {
  try {
    const body = req.body;
    if (!body.designName || !body.designDate) {
      return res
        .status(400)
        .json({ message: "designName and designDate required" });
    }

    const existing = await findDesignByName(body.designName);
    if (existing.length > 0) {
      return res.status(409).json({ message: "Design name already exists!" });
    }

    const designDate = parseDateToISO(body.designDate);
    const designId = await insertDesign({ ...body, designDate });

    const warpArrays = {
      individualWarpCosts: body.individualWarpCosts || [],
      individualProfits: body.individualProfits || [],
      individualTotalCosts: body.individualTotalCosts || [],
      individualGsts: body.individualGsts || [],
      individualFinalTotals: body.individualFinalTotals || [],
    };

    for (let i = 0; i < (body.warps || []).length; i++) {
      const warp = body.warps[i];
      const warpWeight = parseFloat(
        (body.warpWeights && body.warpWeights[i]) || 0
      );
      await insertWarp(designId, warp, warpWeight, i, warpArrays);
    }

    const weftArrays = {
      individualWeftCosts: body.individualWeftCosts || [],
      individualProfits: body.individualProfits || [],
      individualTotalCosts: body.individualTotalCosts || [],
      individualGsts: body.individualGsts || [],
      individualFinalTotals: body.individualFinalTotals || [],
    };

    for (let i = 0; i < (body.wefts || []).length; i++) {
      const weft = body.wefts[i];
      const weftWeight = parseFloat(
        (body.weftWeights && body.weftWeights[i]) || 0
      );
      await insertWeft(designId, weft, weftWeight, i, weftArrays);
    }

    return res
      .status(200)
      .json({ message: "Design inserted successfully", designId });
  } catch (err) {
    console.error("submitDesign error:", err);
    return res
      .status(500)
      .json({ message: "Insert failed", error: err.message });
  }
};
