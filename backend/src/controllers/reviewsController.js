import Review from "../models/Reviews.js";
import Customer from "../models/Customers.js";
import Product from "../models/Products.js";
import { v2 as cloudinary } from "cloudinary";



cloudinary.config({
  cloud_name: 'dosy4rouu',
  api_key: '712175425427873',
  api_secret: 'Yk2vqXqQ6aknOrT7FCoqEiWw31w',
});

const reviewsController = {};

// Obtener todas las reseñas
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

// Obtener una reseña por ID
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
    res.status(5400).json({
      message: "Error fetching review",
      error: error.message,
    });
  }
};

// Obtener todas las reseñas de un producto específico
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
    res.status(500).json({
      message: "Error fetching reviews for product",
      error: error.message,
    });
  }
};

// Crear una nueva reseña
reviewsController.createReview = async (req, res) => {
  const { id_customer, id_product, rank, comment } = req.body;

  try {
    // Validar campos obligatorios
    if (!id_customer || !id_product || rank == null || !comment?.trim()) {
      return res.status(400).json({ message: "All fields are required: customer, product, rank, comment" });
    }

    if (rank < 1 || rank > 5) {
      return res.status(400).json({ message: "Rank must be between 1 and 5" });
    }

    // Validar existencia de cliente y producto
    const customer = await Customer.findById(id_customer);
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    const product = await Product.findById(id_product);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
 let uploadedImages = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: "products",
          allowed_formats: ["png", "jpg", "jpeg", "PNG", "JPG"],
          transformation: [
            { width: 800, height: 800, crop: "fill" },
            { quality: "auto" }
          ]
        });
        uploadedImages.push(result.secure_url);
        await fs.unlink(file.path);
      }
    }

    // Crear reseña
    const newReview = new Review({
      id_customer,
      id_product,
      rank,
      comment: comment.trim(),
      images: uploadedImages,
    });

    const savedReview = await newReview.save();

    const populatedReview = await Review.findById(savedReview._id)
      .populate({ path: "id_customer", select: "-password" })
      .populate("id_product");

    res.status(201).json(populatedReview);
  } catch (error) {
    res.status(500).json({
      message: "Error creating review",
      error: error.message,
    });
  }
};

// Actualizar reseña
reviewsController.updateReview = async (req, res) => {
  const { rank, comment } = req.body;

  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    // Validar rank si se envía
    if (rank !== undefined) {
      if (rank < 1 || rank > 5) {
        return res.status(400).json({ message: "Rank must be between 1 and 5" });
      }
      review.rank = rank;
    }

    // Validar comment si se envía
    if (comment !== undefined) {
      if (!comment.trim()) {
        return res.status(400).json({ message: "Comment cannot be empty" });
      }
      review.comment = comment.trim();
    }

    const updatedReview = await review.save();

    const populatedReview = await Review.findById(updatedReview._id)
      .populate({ path: "id_customer", select: "-password" })
      .populate("id_product");

    res.status(200).json(populatedReview);
  } catch (error) {
    res.status(500).json({
      message: "Error updating review",
      error: error.message,
    });
  }
};

// Eliminar reseña
reviewsController.deleteReview = async (req, res) => {
  try {
    const deletedReview = await Review.findByIdAndDelete(req.params.id);

    if (!deletedReview) {
      return res.status(404).json({ message: "Review not found" });
    }

    res.json({ message: "Review deleted successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting review",
      error: error.message,
    });
  }
};

export default reviewsController;