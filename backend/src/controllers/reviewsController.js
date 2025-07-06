// backend/src/controllers/reviewsController.js

import Review from "../models/Reviews.js";
import Customer from "../models/Customers.js";
import Product from "../models/Products.js";

const reviewsController = {};

// GET: Obtener todas las reviews
reviewsController.getReviews = async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate({ path: "id_customer", select: "-password" })
      .populate("id_product");

    res.json(reviews);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching reviews",
      error: error.message,
    });
  }
};

// GET: Obtener una review por ID
reviewsController.getReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id)
      .populate({ path: "id_customer", select: "-password" })
      .populate("id_product");

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    res.json(review);
  } catch (error) {
    res.status(400).json({
      message: "Error fetching review",
      error: error.message,
    });
  }
};

// GET: Obtener todas las reviews de un producto específico
reviewsController.getReviewsByProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const reviews = await Review.find({ id_product: id })
      .populate({ path: "id_customer", select: "-password" })
      .populate("id_product");

    if (!reviews || reviews.length === 0) {
      return res.status(404).json({ message: "No reviews found for this product" });
    }

    res.json(reviews);
  } catch (error) {
    res.status(400).json({
      message: "Error fetching reviews for product",
      error: error.message,
    });
  }
};

// POST: Crear una nueva review
reviewsController.createReview = async (req, res) => {
  const { id_customer, id_product, rank, comment } = req.body;

  try {
    const customer = await Customer.findById(id_customer);
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    const product = await Product.findById(id_product);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const newReview = new Review({
      id_customer,
      id_product,
      rank,
      comment,
    });

    const savedReview = await newReview.save();

    const populatedReview = await Review.findById(savedReview._id)
      .populate({ path: "id_customer", select: "-password" })
      .populate("id_product");

    res.status(201).json(populatedReview);
  } catch (error) {
    res.status(400).json({
      message: "Error creating review",
      error: error.message,
    });
  }
};

// PUT: Actualizar una review existente
reviewsController.updateReview = async (req, res) => {
  const { rank, comment } = req.body;

  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    if (rank !== undefined) review.rank = rank;
    if (comment !== undefined) review.comment = comment;

    const updatedReview = await review.save();

    const populatedReview = await Review.findById(updatedReview._id)
      .populate({ path: "id_customer", select: "-password" })
      .populate("id_product");

    res.status(200).json(populatedReview);
  } catch (error) {
    res.status(400).json({
      message: "Error updating review",
      error: error.message,
    });
  }
};

// DELETE: Eliminar una review
reviewsController.deleteReview = async (req, res) => {
  try {
    const deletedReview = await Review.findByIdAndDelete(req.params.id);

    if (!deletedReview) {
      return res.status(404).json({ message: "Review not found" });
    }

    res.json({ message: "Review deleted successfully" });
  } catch (error) {
    res.status(400).json({
      message: "Error deleting review",
      error: error.message,
    });
  }
};

export default reviewsController;
