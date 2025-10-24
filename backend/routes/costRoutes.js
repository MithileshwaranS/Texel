import express from "express";
import * as costController from "../controllers/costController.js";

const router = express.Router();

router.get("/costingDetails", costController.getAllCosts);
router.get("/costingDetails/:id", costController.getCostById);

export default router;
