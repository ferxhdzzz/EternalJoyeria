import { Router } from "express";
import salesController from "../controllers/salesController.js"; // Ajusta el path según tu estructura

const router = Router();

// GET: Obtener todas las ventas
router.get("/", salesController.getSales);

// GET: Obtener una venta específica por ID
router.get("/:id", salesController.getSale);



export default router;
