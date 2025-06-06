// backend/src/routers/logout.js
import { Router } from "express";
import { logoutClient } from "../controllers/logoutController.js";
import { protect } from "../utils/authMiddleware.js";

const router = Router();

router.post("/", protect, logoutClient);

export default router;
