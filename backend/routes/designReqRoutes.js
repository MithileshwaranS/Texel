import express from "express";
import {
  createDesignReq,
  getDesignReqs,
} from "../controllers/designReqController.js";
const router = express.Router();

router.post("/", createDesignReq);
router.get("/", getDesignReqs);
export default router;
