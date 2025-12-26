// routes/designRoutes.js
import express from "express";
import { submitDesign, deleteDesign } from "../controllers/designController.js";

const router = express.Router();

router.post("/", submitDesign);
router.delete("/:id", deleteDesign);

export default router;
