import express from "express";
import {
  createDesignReq,
  getDesignReqs,
  getDesignReqById,
} from "../controllers/designReqController.js";
const router = express.Router();

router.post("/", createDesignReq);
router.get("/", getDesignReqs);
router.get("/:id", getDesignReqById);

export default router;
