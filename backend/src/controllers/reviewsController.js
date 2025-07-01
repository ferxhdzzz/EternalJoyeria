// Importar el modelo Review desde la carpeta models
import Review from "../models/Reviews.js";
import Customer from "../models/Customers.js";

// Crear objeto para contener todos los métodos del controlador
const reviewsController = {};

//GET review
reviewsController.getReviews = async (req, res) => {
  try {
    // Buscar todas las reviews y poblar datos del cliente relacionado
    const reviews = await Review.find().populate("id_customer");

    // Enviar respuesta exitosa con todas las reviews
    res.json(reviews);
  } catch (error) {
    // Manejo de errores del servidor
    res.status(500).json({
      message: "Error fetching reviews",
      error: error.message
    });
  }
};

//GET review por ID
reviewsController.getReview = async (req, res) => {
  try {
    // Buscar review por ID y poblar datos del cliente relacionado
    const review = await Review.findById(req.params.id).populate("id_customer");

    // Verificar si la review existe
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    // Enviar respuesta exitosa con la review encontrada
    res.json(review);
  } catch (error) {
    // Manejo de errores (ID inválido u otros)
    res.status(400).json({
      message: "Error fetching review",
      error: error.message
    });
  }
};

//POST review
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
      comment
    });

    // Guardar la review
    const savedReview = await newReview.save();

    // Buscar la review recién creada y poblar datos del cliente
    const populatedReview = await Review.findById(savedReview._id).populate("id_customer");

    // Enviar respuesta exitosa con la review creada
    res.status(201).json(populatedReview);
  } catch (error) {
    // Manejo de errores del servidor
    res.status(400).json({
      message: "Error creating review",
      error: error.message
    });
  }
};

//UPDATE review
reviewsController.updateReview = async (req, res) => {
  const { rank, comment } = req.body;

  try {
    // Buscar review por ID
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    // Actualizar campos de la review
    if (rank !== undefined) review.rank = rank;
    if (comment !== undefined) review.comment = comment;

    // Guardar cambios
    const updatedReview = await review.save();

    // Buscar la review actualizada y poblar datos del cliente
    const populatedReview = await Review.findById(updatedReview._id).populate("id_customer");

    // Enviar respuesta exitosa con la review actualizada
    res.status(200).json(populatedReview);
  } catch (error) {
    // Manejo de errores del servidor
    res.status(400).json({
      message: "Error updating review",
      error: error.message
    });
  }
};

//DELETE review
reviewsController.deleteReview = async (req, res) => {
  try {
    // Buscar y eliminar la review por ID
    const deletedReview = await Review.findByIdAndDelete(req.params.id);

    if (!deletedReview) {
      return res.status(404).json({ message: "Review not found" });
    }

    // Enviar respuesta exitosa
    res.json({ message: "Review deleted successfully" });
  } catch (error) {
    // Manejo de errores del servidor
    res.status(400).json({
      message: "Error deleting review",
      error: error.message
    });
  }
};

export default reviewsController;
