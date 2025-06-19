import express from "express";
import customersController from "../controllers/customersController.js";
// Router() nos ayuda a colocar los metodos
// que tendra mi ruta
const router = express.Router();

router
  .route("/")
  //ruta de metodo get
  .get(customersController.getcustomers)

//no hay metodo insert, porque lo realiza el register

router
  .route("/:id")
//ruta del metodo para actualizar
  .put(customersController.updatecustomers)
  //ruta del metodo eliminar
  .delete(customersController.deletecustomers);

export default router;