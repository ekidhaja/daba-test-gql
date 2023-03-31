import { Router } from "express";
import { getOrders, getOrder, placeOrder, cancelOrder } from "../controllers/OrderController";

const router = Router();

router.get("/", getOrders);
router.get("/:id", getOrder);
router.post("/", placeOrder);
router.delete("/:id", cancelOrder);

export default router;
