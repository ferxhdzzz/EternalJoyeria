// backend/src/routers/reviews.js
import express from "express";
import reviewsController from "../controllers/reviewsController.js";

const router = express.Router();


router.post("/", reviewsController.createReview);
router.get("/", reviewsController.getReviews);


router.get("/:id", reviewsController.getReview);
router.put("/:id", reviewsController.updateReview);
router.delete("/:id", reviewsController.deleteReview);
router.get("/product/:id", reviewsController.getReviewsByProduct);

export default router;
