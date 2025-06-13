// backend/src/routers/registerClient.js
import { Router } from "express";
import registerCustomersController from "../controllers/registerCustomersController.js";

const router = Router();

router.post("/", registerCustomersController.registerClient);
// /api/registerClients/verifyCodeEmail
router.route("/verifyCodeEmail").post(registerCustomersController.verifyCodeEmail)

export default router;