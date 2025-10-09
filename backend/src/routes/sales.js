import { Router } from "express";
import salesController from "../controllers/salesController.js";

const router = Router();

// CRÍTICO: Las rutas específicas DEBEN ir ANTES de las rutas con parámetros

// 1. Rutas especializadas PRIMERO (para evitar conflictos con /:id)
router.get("/monthly", salesController.getMonthlySales); //  Esta DEBE ir PRIMERA
router.get("/category", salesController.getSalesByCategory);
router.get("/by-customer/:id", salesController.getSalesByCustomer);
router.get("/check-purchase/:customerId/:productId", salesController.checkProductPurchase);

// 2. Rutas generales
router.post("/", salesController.createSale);
router.get("/", salesController.getSales);

// 3. Rutas con parámetros AL FINAL (para que no capturen rutas específicas)
router.get("/:id", salesController.getSale);
router.put("/:id", salesController.updateSale);
router.delete("/:id", salesController.deleteSale);

export default router;