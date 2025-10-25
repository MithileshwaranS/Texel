import express from "express";
import * as yarnController from "../controllers/yarnController.js";

const router = express.Router();

router.get("/yarnCounts", yarnController.getYarnCounts);
router.put("/editYarn/:id", yarnController.editYarn);
router.get("/yarnPriceHistory/:yarnCount", yarnController.getYarnPriceHistory);
router.get("/yarnPrice", yarnController.getYarnPrice);

export default router;
