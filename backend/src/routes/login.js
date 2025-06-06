//ruta login// backend/src/routers/login.js
/**
 * Route: POST /api/login/login
 * Description: User login (returns a JWT cookie if successful)
 */

 import express from "express"
import loginController from "../controllers/loginController.js"
const router = express.Router();

router.route("/").post(loginController.login)

export default router;