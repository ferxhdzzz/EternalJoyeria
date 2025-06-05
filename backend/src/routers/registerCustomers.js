// backend/src/routers/registerClient.js
import { Router } from "express";
import { registerCustomers } from "../controllers/registerCustomersController.js";

const router = Router();

/**
 * Route: POST /api/registerClient
 * Description: Register a new client (no authentication needed)
 */
router.post("/", registerCustomers);

export default router;
