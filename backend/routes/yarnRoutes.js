import express from "express";
import * as yarnController from "../controllers/yarnController.js";

const router = express.Router();

router.get("yarnCounts", yarnController.getYarnCounts);

export default router;
