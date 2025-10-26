// routes/designRoutes.js
import express from "express";
import { submitDesign } from "../controllers/designController.js";

const router = express.Router();

router.post("/submit", submitDesign);

export default router;
