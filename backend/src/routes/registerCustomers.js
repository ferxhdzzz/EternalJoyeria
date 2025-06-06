// backend/src/routers/registerClient.js
import { Router } from "express";
import { registerCustomers } from "../controllers/registerCustomersController.js";

const router = Router();

router.post("/", registerCustomers);

export default router;
