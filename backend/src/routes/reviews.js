// backend/src/routers/reviews.js
import express from "express";
import multer from "multer";
import reviewsController from "../controllers/reviewsController.js";

const router = express.Router();

const upload = multer({ dest: "public/" });


// CORRECCIÓN: Agregar la barra inicial (/)
router.get("/user/:id", reviewsController.getReviewsByUser);

// Luego las otras rutas (no te preocupes por el orden entre ellas)
router.post("/",upload.array("images", 5), reviewsController.createReview);
router.get("/", reviewsController.getReviews);
router.get("/product/:id", reviewsController.getReviewsByProduct);

// ✅ Y la ruta genérica al final.
router.get("/:id", reviewsController.getReview);
router.put("/:id", upload.array("images"), reviewsController.updateReview);
router.delete("/:id", reviewsController.deleteReview);

export default router;