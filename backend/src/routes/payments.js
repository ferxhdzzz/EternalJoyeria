import express from "express";
import { createPendingOrder, markOrderAsPaid } from "../controllers/paymentController.js";
import { validateAuthToken } from "../middlewares/validateAuthToken.js";

const router = express.Router();

router.post("/create", validateAuthToken(["customer"]), createPendingOrder);
router.post("/complete", validateAuthToken(["admin"]), markOrderAsPaid);

export default router;
