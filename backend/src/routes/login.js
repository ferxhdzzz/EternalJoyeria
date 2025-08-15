// backend/src/routes/login.js
import { Router } from "express";
import loginController from "../controllers/loginController.js";

const router = Router();

/**
 * Route: POST /api/login/login
 * Description: User login (returns a JWT cookie if successful)
 */
router.post("/", loginController.login);

// Ruta para verificar si el usuario es admin
router.get("/checkAdmin", loginController.checkAdmin);

// Ruta para obtener los datos del usuario autenticado
router.get("/me", loginController.getUserData);

export default router;
