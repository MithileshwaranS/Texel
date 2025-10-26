import { queryDB } from "../config/db.js";

export const findDesignByName = async (designName) => {
  const res = await queryDB("SELECT * FROM designs WHERE designname = $1", [
    designName,
  ]);
  return res.rows;
};
export const insertDesign = async (designData) => {
  const q = `INSERT INTO designs (
    designname, created_date, profitpercent, weavingcost, washingcost, mendingcost,
    transportcost, gst, width, warpcost, weftcost, designimage, designImagePublicId, subtotal, finaltotal, profit, design_status
  ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17) RETURNING design_id`;

  const params = [
    designData.designName,
    designData.designDate,
    designData.profitPercent,
    designData.weaving,
    designData.washing,
    designData.mending,
    designData.transport,
    designData.gst,
    designData.width,
    parseFloat(designData.warpCost || 0),
    parseFloat(designData.weftCost || 0),
    designData.designImage,
    designData.designImagePublicId,
    designData.totalCost,
    designData.finaltotal,
    designData.profit,
    designData.designStatus,
  ];

  const res = await queryDB(q, params);
  return res.rows[0].design_id;
};

export const insertWarp = async (
  designId,
  warp,
  warpWeight = 0,
  idx = 0,
  arrays = {}
) => {
  const q = `INSERT INTO warps (
    design_id, warpcount, warpweight, initwarpcost, warpdyeing, reed, individualwarpcost, individualprofit, individualtotalcost, individualgst, individualfinalcost
  ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)`;

  const params = [
    designId,
    warp.count,
    warpWeight,
    warp.cost,
    warp.dyeing,
    parseFloat(warp.reed || 0),
    arrays.individualWarpCosts?.[idx] ?? null,
    arrays.individualProfits?.[idx] ?? null,
    arrays.individualTotalCosts?.[idx] ?? null,
    arrays.individualGsts?.[idx] ?? null,
    arrays.individualFinalTotals?.[idx] ?? null,
  ];

  return queryDB(q, params);
};

export const insertWeft = async (
  designId,
  weft,
  weftWeight = 0,
  idx = 0,
  arrays = {}
) => {
  const q = `INSERT INTO wefts (
    design_id, weftcount, weftweight, initweftcost, weftdyeing, pick, individualweftcost, individualprofit, individualtotalcost, individualgst, individualfinalcost
  ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)`;

  const params = [
    designId,
    weft.count,
    weftWeight,
    weft.cost,
    weft.dyeing,
    parseFloat(weft.pick || 0),
    arrays.individualWeftCosts?.[idx] ?? null,
    arrays.individualProfits?.[idx] ?? null,
    arrays.individualTotalCosts?.[idx] ?? null,
    arrays.individualGsts?.[idx] ?? null,
    arrays.individualFinalTotals?.[idx] ?? null,
  ];

  return queryDB(q, params);
};
