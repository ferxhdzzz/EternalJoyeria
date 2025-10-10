import express from "express";
import multer from "multer";
import productController from "../controllers/productsController.js";
import { validateAuthToken } from "../middlewares/validateAuthToken.js";

const router = express.Router();

// Configura multer para subir múltiples archivos
const upload = multer({ dest: "public/" });

router.post("/", upload.array("images"), productController.createProduct);
router.put("/:id", upload.array("images"), productController.updateProduct);

router.get("/", productController.getAllProducts);

// ⚠️ IMPORTANTE: Todas las rutas específicas DEBEN ir ANTES que las rutas con parámetros /:id

// RUTA TEMPORAL PARA DEBUGGING DE STOCK
router.get("/debug/stock", productController.checkStock);

// RUTA DE PRUEBA SIN AUTENTICACIÓN
router.get("/test-endpoint", (req, res) => {
  res.json({ message: "Endpoint funcionando", timestamp: new Date().toISOString() });
});

// RUTA TEMPORAL SIN AUTENTICACIÓN PARA DEBUGGING
router.get("/check-purchase-test/:productId", (req, res) => {
  console.log(`🧪 [TEST] Endpoint alcanzado - Producto: ${req.params.productId}`);
  res.json({ 
    success: true, 
    message: "Endpoint funcionando", 
    productId: req.params.productId,
    timestamp: new Date().toISOString() 
  });
});

// RUTA TEMPORAL SIN AUTENTICACIÓN PARA DEBUGGING REAL
router.get("/check-purchase-noauth/:productId", productController.checkUserPurchase);

// RUTA PARA VERIFICAR SI USUARIO COMPRÓ UN PRODUCTO (requiere autenticación)
router.get("/check-purchase/:productId", validateAuthToken(['customer']), productController.checkUserPurchase);

// Rutas específicas de categoría
router.get("/category/:id", productController.getProductsByCategory);

// ⚠️ ESTA RUTA DEBE IR AL FINAL porque captura cualquier /:id
router.get("/:id", productController.getProductById);
router.delete("/:id", productController.deleteProduct);

export default router;
