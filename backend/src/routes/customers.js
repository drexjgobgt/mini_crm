import express from "express";
import * as customerController from "../controllers/customerController.js";
import {
  validateId,
  validateCustomer,
  validateCustomerId,
} from "../middleware/validation.js";
import { strictLimiter } from "../middleware/security.js";

const router = express.Router();

router.get("/", customerController.getAllCustomers);
router.get("/:id", validateId, customerController.getCustomerById);
router.post(
  "/",
  strictLimiter,
  validateCustomer,
  customerController.createCustomer
);
router.put(
  "/:id",
  strictLimiter,
  validateId,
  validateCustomer,
  customerController.updateCustomer
);
router.delete(
  "/:id",
  strictLimiter,
  validateId,
  customerController.deleteCustomer
);

export default router;
