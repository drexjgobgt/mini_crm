import express from "express";
import * as followupController from "../controllers/followupController.js";
import { validateId, validateFollowup } from "../middleware/validation.js";
import { strictLimiter, exportLimiter } from "../middleware/security.js";

const router = express.Router();

router.get("/", followupController.getFollowups);
router.post(
  "/",
  strictLimiter,
  validateFollowup,
  followupController.createFollowup
);
router.patch(
  "/:id/complete",
  strictLimiter,
  validateId,
  followupController.completeFollowup
);
router.get("/export", exportLimiter, followupController.exportToExcel);

export default router;
