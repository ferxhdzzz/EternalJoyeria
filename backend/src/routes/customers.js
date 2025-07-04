import express from "express";
import multer from "multer";
import customersController from "../controllers/customersController.js";

const router = express.Router();

// Configurar multer para manejar archivos (imagen de perfil)
const upload = multer({ dest: "public/" });

// Rutas para clientes
router
  .route("/")
  // Obtener lista de clientes
  .get(customersController.getcustomers);

// Rutas para operaciones por ID
router
  .route("/:id")
  // Actualizar cliente (con posible imagen)
  .put(upload.single("profilePicture"), customersController.updatecustomers)
  // Eliminar cliente
  .delete(customersController.deletecustomers);

export default router;
