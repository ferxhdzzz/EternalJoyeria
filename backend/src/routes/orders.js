import { Router } from "express";
import ordersController from "../controllers/ordersController.js";

const router = Router();

router.post("/", ordersController.createOrder);
router.get("/", ordersController.getOrders);
router.get("/:id", ordersController.getOrder);
router.put("/:id", ordersController.updateOrder);
router.delete("/:id", ordersController.deleteOrder);


router.patch("/:id/pay", ordersController.markAsPaid);

export default router;