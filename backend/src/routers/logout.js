// backend/src/routers/logout.js
import { Router } from "express";
import { logoutClient } from "../controllers/logoutController.js";
import { protect } from "../utils/authMiddleware.js";

const router = Router();

/**
 * Route: POST /api/logout
 * Description: Logs out the user by clearing the JWT cookie
 * Access: Private (user must be logged in)
 */
router.post("/", protect, logoutClient);

export default router;
