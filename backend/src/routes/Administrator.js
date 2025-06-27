import express from "express";
import multer from "multer";
import adminController from "../controllers/AdministratorController.js";

const router = express.Router();

// Configurar multer para manejar archivos (imagen de perfil)
const upload = multer({ dest: "public/" });

// Rutas para administradores
router
  .route("/")  .get(adminController.getadmins);

// Rutas para operaciones por ID
router
  .route("/:id")
  // Obtener administrador por ID
  .get(adminController.getadminById)
  // Actualizar administrador (con posible imagen)
  .put(upload.single("profileImage"), adminController.updateadmin)
  // Eliminar administrador
  .delete(adminController.deleteadmin);

export default router;