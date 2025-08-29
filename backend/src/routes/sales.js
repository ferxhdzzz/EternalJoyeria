import { Router } from "express";
import salesController from "../controllers/salesController.js";

const router = Router();

// Rutas de uso general para la gestión de ventas
router.post("/", salesController.createSale); // Crear una nueva venta
router.get("/", salesController.getSales); // Obtener todas las ventas

// Rutas especializadas (DEBEN ir ANTES de /:id para evitar conflictos)
router.get("/monthly", salesController.getMonthlySales); // NUEVA: Obtener ventas mensuales para el gráfico
router.get("/category", salesController.getSalesByCategory); // Obtener ventas agrupadas por categoría
router.get("/by-customer/:id", salesController.getSalesByCustomer); // Obtener el historial de ventas por cliente

// Rutas con parámetros (van al final)
router.get("/:id", salesController.getSale); // Obtener una venta específica por su ID
router.put("/:id", salesController.updateSale); // Actualizar una venta
router.delete("/:id", salesController.deleteSale); // Eliminar una venta

export default router;