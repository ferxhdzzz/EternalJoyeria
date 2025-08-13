// 📁 routes/contactusRoutes.js

import express from "express";
import contactusController from "../controllers/contactusController.js";

const router = express.Router();

/**
 * POST /api/contactus/send
 * Ruta para enviar mensajes del formulario de contacto
 * 
 * Body esperado:
 * {
 *   "fullName": "Juan Pérez",
 *   "email": "juan@ejemplo.com",
 *   "phone": "+503 1234-5678", // Opcional
 *   "subject": "Consulta sobre productos",
 *   "message": "Me interesa conocer más sobre sus joyas..."
 * }
 */
router.post("/send", contactusController.sendContactMessage);

export default router;

// ===== INTEGRACIÓN EN APP PRINCIPAL =====
/*
En tu archivo app.js o server.js, agregar:

import contactusRoutes from "./routes/contactusRoutes.js";

// Usar las rutas de contacto
app.use("/api/contactus", contactusRoutes);
*/