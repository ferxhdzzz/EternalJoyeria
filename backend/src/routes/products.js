import express from "express";
import multer from "multer";
import productController from "../controllers/productsController.js";

const router = express.Router();

// Configura multer para subir múltiples archivos
const upload = multer({ dest: "public/" });

router.post("/", upload.array("images"), productController.createProduct);
router.put("/:id", upload.array("images"), productController.updateProduct);

router.get("/", productController.getAllProducts);
router.get("/:id", productController.getProductById);
router.delete("/:id", productController.deleteProduct);

export default router;
