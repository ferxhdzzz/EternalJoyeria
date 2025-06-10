import express from "express";
import productController from "../controllers/productController.js";

const router = express.Router();

router
  .route("/")
  .get(productController.getAllProducts)
  .post(productController.createProduct);

router
  .route("/:id")
  .get(productController.getProductById)
  .put(productController.updateProduct)
  .delete(productController.deleteProduct);

export default router;
