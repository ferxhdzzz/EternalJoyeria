import { Router } from "express";
import ordersController from "../controllers/ordersController.js";
// Asumiendo que validateAuthToken(['admin']) valida el token Y el rol
import { validateAuthToken } from "../middlewares/validateAuthToken.js"; 

const router = Router();

// =================================================================
// RUTAS DE CARRITO Y FLUJO DE COMPRA (Necesitan autenticación de usuario/cliente)
// Estas rutas funcionan perfectamente con la lógica de req.userId que ya tienes.
// =================================================================

/* ===== Carrito por usuario (CUSTOMER / ADMIN) ===== */
// GET /api/orders/cart -> Obtiene/Crea el carrito ligado a req.userId
router.get("/cart", validateAuthToken(['customer', 'admin']), ordersController.getOrCreateCart);
// PUT /api/orders/cart/items -> Sincroniza ítems en el carrito ligado a req.userId
router.put("/cart/items", validateAuthToken(['customer', 'admin']), ordersController.syncCartItems);
// PUT /api/orders/cart/addresses -> Guarda la dirección en el carrito ligado a req.userId
router.put("/cart/addresses", validateAuthToken(['customer', 'admin']), ordersController.saveCartAddresses);
// POST /api/orders/:orderId/pending -> Mueve el carrito a pendiente de pago
router.post("/:orderId/pending", validateAuthToken(['customer', 'admin']), ordersController.moveToPending);
// POST /api/orders/orders/:id/finish -> Finaliza la orden y la marca como pagada
router.post("/orders/:id/finish", validateAuthToken(['customer', 'admin']), ordersController.finishOrder);


/* ===== Pedidos del usuario (CUSTOMER / ADMIN) ===== */
// GET /api/orders/user -> Obtiene el historial de órdenes del req.userId (excluye el carrito)
router.get("/user", validateAuthToken(['customer', 'admin']), ordersController.getUserOrders);


// =================================================================
// RUTAS CRUD GENERAL (Necesitan rol de ADMIN)
// Se han agregado las restricciones de seguridad.
// =================================================================

/* ===== CRUD general (ADMIN ONLY) ===== */
// POST /api/orders/ -> Crear orden manualmente (ADMIN)
router.post("/", validateAuthToken(['admin']), ordersController.createOrder);

// GET /api/orders/ -> Obtener TODAS las órdenes (ADMIN)
router.get("/", validateAuthToken(['admin']), ordersController.getOrders);

// PUT /api/orders/:id -> Actualizar una orden por ID (ADMIN)
router.put("/:id", validateAuthToken(['admin']), ordersController.updateOrder);

// DELETE /api/orders/:id -> Eliminar una orden por ID (ADMIN)
router.delete("/:id", validateAuthToken(['admin']), ordersController.deleteOrder);

// PATCH /api/orders/:id/pay -> Marcar como pagada (ADMIN)
router.patch("/:id/pay", validateAuthToken(['admin']), ordersController.markAsPaid);


/* ===== Ruta específica por ID (ADMIN ONLY) ===== */
// GET /api/orders/:id -> Obtener una orden por ID (ADMIN)
router.get("/:id", validateAuthToken(['admin']), ordersController.getOrder);


export default router;