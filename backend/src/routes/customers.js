import express from "express";
import multer from "multer";
import customersController from "../controllers/customersController.js";
import { validateAuthToken } from "../middlewares/validateAuthToken.js";

const router = express.Router();
const upload = multer({ dest: "public/" });

// RUTAS ESPECÍFICAS (deben ir ANTES de las rutas con parámetros)
// Ruta para renovar token (sin validación previa)
router.post("/refresh-token", customersController.refreshToken);

// Ruta de prueba para Cloudinary (sin validación)
router.post("/test-cloudinary", upload.single("testImage"), customersController.testCloudinary);

// Ruta protegida para obtener perfil del usuario autenticado
router.get("/me", validateAuthToken(["customer", "admin"]), customersController.getCurrentCustomer);

// Ruta protegida para actualizar perfil del usuario autenticado
router.put("/me", validateAuthToken(["customer", "admin"]), upload.single("profilePicture"), customersController.updateCurrentCustomer);

// RUTAS GENERALES
router.get("/", customersController.getcustomers);

// RUTAS CON PARÁMETROS (deben ir AL FINAL)
router
  .route("/:id")
  // Obtener cliente por ID
  .get(customersController.getCustomerById)
  // Actualizar cliente (con posible imagen)
  .put(upload.single("profilePicture"), customersController.updatecustomers)
  .delete(customersController.deletecustomers);

export default router;
