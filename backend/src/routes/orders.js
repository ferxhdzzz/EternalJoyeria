import { Router } from "express";
import ordersController from "../controllers/ordersController.js";
import { validateAuthToken } from "../middlewares/validateAuthToken.js";

const router = Router();

/* ===== Carrito por usuario ===== */
router.get("/cart", validateAuthToken(['customer', 'admin']), ordersController.getOrCreateCart);
router.put("/cart/items", validateAuthToken(['customer', 'admin']), ordersController.syncCartItems);
router.put("/cart/addresses", validateAuthToken(['customer', 'admin']), ordersController.saveCartAddresses);
router.post("/:orderId/pending", validateAuthToken(['customer', 'admin']), ordersController.moveToPending);
router.post("/orders/:id/finish", validateAuthToken(['customer', 'admin']), ordersController.finishOrder);



/* ===== Pedidos del usuario ===== */
router.get("/user", validateAuthToken(['customer', 'admin']), ordersController.getUserOrders);

/* ===== CRUD general ===== */
router.post("/", ordersController.createOrder);
router.get("/", ordersController.getOrders);
router.put("/:id", ordersController.updateOrder);
router.delete("/:id", ordersController.deleteOrder);
router.patch("/:id/pay", ordersController.markAsPaid);

/* ===== Ruta específica por ID (debe ir al final) ===== */
router.get("/:id", ordersController.getOrder);

export default router;