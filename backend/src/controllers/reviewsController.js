// backend/src/controllers/reviewsController.js

import Review from "../models/Reviews.js";
import Customer from "../models/Customers.js";

const reviewsController = {};

// READ: Obtener todas las reviews
reviewsController.getReviews = async (req, res) => {
  try {
    const reviews = await Review.find().populate("id_customer");
    res.json(reviews);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching reviews", error: error.message });
  }
};

// READ: Obtener una review específica
reviewsController.getReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id).populate("id_customer");

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    res.json(review);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error fetching review", error: error.message });
  }
};

// CREATE: Crear una nueva review
reviewsController.createReview = async (req, res) => {
  const { id_customer, rank, comment } = req.body;

  try {
    // Validar que el cliente existe
    const customer = await Customer.findById(id_customer);
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    // Crear la nueva review
    const newReview = new Review({
      id_customer,
      rank,
      comment,
    });

    // Guardar la review
    await newReview.save();
    res.status(201).json({ message: "Review created successfully" });
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error creating review", error: error.message });
  }
};

// UPDATE: Actualizar una review
reviewsController.updateReview = async (req, res) => {
  const { rank, comment } = req.body;

  try {
    const updatedReview = await Review.findByIdAndUpdate(
      req.params.id,
      { rank, comment },
      { new: true }
    );

    if (!updatedReview) {
      return res.status(404).json({ message: "Review not found" });
    }

    res.json({ message: "Review updated successfully" });
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error updating review", error: error.message });
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
    res
      .status(400)
      .json({ message: "Error deleting review", error: error.message });
  }
};

export default reviewsController;
