// backend/src/routers/registerClient.js
import express from "express";
import multer from "multer";
import registerCustomersController from "../controllers/registerCustomersController.js";

const router = express.Router();

// Configurar multer para manejar archivos de imagen
const upload = multer({ dest: "public/" });

// Ruta para registro con imagen opcional
router.post("/", upload.single("profilePicture"), registerCustomersController.registerClient);

// Ruta para verificación de código de email
router.post("/verifyCodeEmail", registerCustomersController.verifyCodeEmail);

export default router;