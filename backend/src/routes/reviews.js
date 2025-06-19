// backend/src/routers/reviews.js
import express from "express";
import reviewsController from "../controllers/reviewsController.js";

const router = express.Router();

// Crear una nueva review
router.post("/", reviewsController.createReview);

// Obtener todas las reviews
router.get("/", reviewsController.getReviews);

// Obtener una review específica por ID
router.get("/:id", reviewsController.getReview);

// Actualizar una review por ID
router.put("/:id", reviewsController.updateReview);

// Eliminar una review por ID
router.delete("/:id", reviewsController.deleteReview);

export default router;
