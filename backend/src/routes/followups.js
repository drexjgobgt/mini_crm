import express from "express";
import * as followupController from "../controllers/followupController.js";

const router = express.Router();

router.get("/", followupController.getFollowups);
router.post("/", followupController.createFollowup);
router.patch("/:id/complete", followupController.completeFollowup);
router.get("/export", followupController.exportToExcel);

export default router;
