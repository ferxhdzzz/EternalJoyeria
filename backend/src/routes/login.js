//ruta login// backend/src/routers/login.js
import { Router } from "express";
import { loginClient } from "../controllers/loginController.js";

const router = Router();

/**
 * Route: POST /api/login/login
 * Description: User login (returns a JWT cookie if successful)
 */
router.post("/login", loginClient);

export default router;
