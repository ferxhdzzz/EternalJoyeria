// backend/src/routers/logout.js

/**
 * Route: POST /api/logout
 * Description: Logs out the user by clearing the JWT cookie
 * Access: Private (user must be logged in)
 */


import express from "express";
import logoutController from "../controllers/logoutController.js";
const router = express.Router();

router.route("/").post(logoutController.logout);

export default router;
