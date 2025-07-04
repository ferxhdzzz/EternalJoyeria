import express from "express";
import multer from "multer";
import adminController from "../controllers/AdministratorController.js";

const router = express.Router();

// Configurar multer para manejar archivos (imagen de perfil)
const upload = multer({ dest: "public/" });

// Rutas para administradores
router
  .route("/")
  .get(adminController.getadmins);

// Rutas para operaciones por ID
router
  .route("/:id")
  .get(adminController.getadminById)
  // Cambiar "profileImage" por "profilePicture"
  .put(upload.single("profilePicture"), adminController.updateadmin)
  .delete(adminController.deleteadmin);

export default router;