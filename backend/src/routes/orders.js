import { Router } from "express";
import ordersController from "../controllers/ordersController.js";
import { validateAuthToken } from "../middlewares/validateAuthToken.js";

const router = Router();

/* ===== Carrito por usuario & Checkout ===== */
router.get("/cart", validateAuthToken(['customer', 'admin']), ordersController.getOrCreateCart);
router.put("/cart/items", validateAuthToken(['customer', 'admin']), ordersController.syncCartItems);
router.put("/cart/addresses", validateAuthToken(['customer', 'admin']), ordersController.saveCartAddresses);

// 👉 RUTA 1: Mueve el carrito a estado 'pending_payment' (para Wompi/pago automático)
router.post("/:orderId/pending", validateAuthToken(['customer', 'admin']), ordersController.moveToPending);

// 🔑 RUTA 2: Mueve el pedido de 'pending_payment' a 'PENDIENTE' (Pago Manual/Transferencia)
// Esta ruta es la que ejecuta la lógica de crear la 'Sale' para el historial.
router.post("/:orderId/manual", validateAuthToken(['customer', 'admin']), ordersController.markAsPendingManual);

/* ===== Pedidos del usuario (Historial) ===== */
router.get("/user", validateAuthToken(['customer', 'admin']), ordersController.getUserOrders);

/* ===== CRUD general & Admin ===== */
router.post("/", ordersController.createOrder);
router.get("/", ordersController.getOrders);
router.put("/:id", ordersController.updateOrder);
router.delete("/:id", ordersController.deleteOrder);
router.patch("/:id/pay", ordersController.markAsPaid);

/* ===== Ruta específica por ID (debe ir al final) ===== */
router.get("/:id", ordersController.getOrder);

export default router;