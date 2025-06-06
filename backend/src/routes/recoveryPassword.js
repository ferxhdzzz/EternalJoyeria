// backend/src/routers/passwordRecovery.js

// Import your password recovery controllers when implemented
// import { requestPasswordRecovery, resetPassword } from "../controllers/passwordRecoveryController.js";


/**
 * Route: POST /api/passwordRecovery/request
 * Description: Request a password reset email (not implemented yet)
 */


/**
 * Route: POST /api/passwordRecovery/reset
 * Description: Reset password using a token (not implemented yet)
 */

 
import express from "express";
import recoveryPasswordController from "../controllers/recoveryPasswordController.js";

const router = express.Router();

router.route("/requestCode").post(recoveryPasswordController.requestCode);
router.route("/verifyCode").post(recoveryPasswordController.verifyCode);
router.route("/newPassword").post(recoveryPasswordController.newPassword);

export default router;
