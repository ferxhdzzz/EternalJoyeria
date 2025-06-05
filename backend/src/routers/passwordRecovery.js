// backend/src/routers/passwordRecovery.js
import { Router } from "express";
// Import your password recovery controllers when implemented
// import { requestPasswordRecovery, resetPassword } from "../controllers/passwordRecoveryController.js";

const router = Router();

/**
 * Route: POST /api/passwordRecovery/request
 * Description: Request a password reset email (not implemented yet)
 */
router.post("/request", (req, res) => {
  return res.status(200).json({ message: "Password recovery request endpoint (not yet implemented)." });
});

/**
 * Route: POST /api/passwordRecovery/reset
 * Description: Reset password using a token (not implemented yet)
 */
router.post("/reset", (req, res) => {
  return res.status(200).json({ message: "Password reset endpoint (not yet implemented)." });
});

export default router;
