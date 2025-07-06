import express from "express";
import multer from "multer";
import categoryController from "../controllers/categoryController.js";

const router = express.Router();
const upload = multer({ dest: "public/" });

router
  .route("/")
  .get(categoryController.getAllCategories)
  .post(upload.single("image"), categoryController.createCategory);

router
  .route("/:id")
  .get(categoryController.getCategoryById)
  .put(upload.single("image"), categoryController.updateCategory)
  .delete(categoryController.deleteCategory);

export default router;
