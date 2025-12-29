import express from "express";
import {
  createDesignReq,
  getDesignReqs,
  getDesignReqById,
  deleteSamplingReq,
} from "../controllers/designReqController.js";
const router = express.Router();

router.post("/", createDesignReq);
router.get("/", getDesignReqs);
router.get("/:id", getDesignReqById);
router.delete("/", deleteSamplingReq);

export default router;
