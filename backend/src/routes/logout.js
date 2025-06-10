//ruta logout
import { Router } from "express";
import logoutController from "../controllers/logoutController.js";
const router = Router();

/**
 * Route: POST /api/logout/logout
 * Description: User logout (clears the JWT cookie)
 */
router.post("/logout", logoutController.logout);

export default router;