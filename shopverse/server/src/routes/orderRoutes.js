import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { createOrder, getMyOrders, getOrderById } from "../Controllers/orderController.js";

const router = express.Router();

router.post("/", protect, createOrder);
router.get("/my-orders", protect, getMyOrders);
router.get("/:id", protect, getOrderById);

export default router;
