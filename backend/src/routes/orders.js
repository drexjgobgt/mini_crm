import express from "express";
import * as orderController from "../controllers/orderController.js";
import { validateOrder, validateCustomerId } from "../middleware/validation.js";
import { strictLimiter } from "../middleware/security.js";

const router = express.Router();

router.get("/", orderController.getAllOrders);
router.get(
  "/customer/:customerId",
  validateCustomerId,
  orderController.getOrdersByCustomer
);
router.post("/", strictLimiter, validateOrder, orderController.createOrder);

export default router;
