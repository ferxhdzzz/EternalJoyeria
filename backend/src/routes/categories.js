// backend/src/routes/categories.js
import express from "express";
import categoryController from "../controllers/categoryController.js";

const router = express.Router();

router
  .route("/")
  .get(categoryController.getAllCategories)  
  .post(categoryController.createCategory);

router
  .route("/:id")
  .get(categoryController.getCategoryById)
  .put(categoryController.updateCategory)
  .delete(categoryController.deleteCategory);

export default router;
