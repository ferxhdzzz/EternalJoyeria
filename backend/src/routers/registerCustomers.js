// backend/src/routers/registerClient.js
import { Router } from "express";
import registerCustomersController from "../controllers/registerCustomersController.js";

const router = Router();

/**
 * Route: POST /api/register/client
 * Description: Register a new client and send verification email
 */
router.post("/", registerCustomersController.registerClient);

export default router;