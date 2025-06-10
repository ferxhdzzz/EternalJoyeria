// backend/src/routers/registerClient.js
import { Router } from "express";
import registerCustomersController from "../controllers/registerCustomersController.js";

const router = Router();

router.post("/", registerCustomersController.registerClient);

export default router;