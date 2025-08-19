import { Router } from "express";
import ordersController from "../controllers/ordersController.js";

const router = Router();

/* ===== Carrito por usuario ===== */
router.get("/cart", ordersController.getOrCreateCart);
router.put("/cart/items", ordersController.syncCartItems);
router.put("/cart/addresses", ordersController.saveCartAddresses);
router.post("/:orderId/pending", ordersController.moveToPending);
router.post("/", ordersController.createOrder);
router.get("/", ordersController.getOrders);
router.get("/:id", ordersController.getOrder);
router.put("/:id", ordersController.updateOrder);
router.delete("/:id", ordersController.deleteOrder);
router.patch("/:id/pay", ordersController.markAsPaid);

export default router;