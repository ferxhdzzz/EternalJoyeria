import express from "express";
import multer from "multer";
import customersController from "../controllers/customersController.js";
import { validateAuthToken } from "../middlewares/validateAuthToken.js";

const router = express.Router();
const upload = multer({ dest: "public/" });

router.get("/", customersController.getcustomers);


// Ruta protegida

router.get("/me", validateAuthToken(["customer", "admin"]), customersController.getCurrentCustomer);

router
  .route("/:id")

  // Obtener cliente por ID
  .get(customersController.getCustomerById)
  // Actualizar cliente (con posible imagen)

  .put(upload.single("profilePicture"), customersController.updatecustomers)
  .delete(customersController.deletecustomers);

export default router;
