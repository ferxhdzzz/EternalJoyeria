import Category from "../models/Category.js"; // Importa el modelo Mongoose para categorías.
import { v2 as cloudinary } from "cloudinary"; // Importa la API de Cloudinary para manejar imágenes.
import { config } from "../config.js"; // Importa configuración (API keys y otros datos).

// Configuración de Cloudinary con las credenciales guardadas en config.js
cloudinary.config({
  cloud_name: config.cloudinary.cloud_name,
  api_key: config.cloudinary.api_key,
  api_secret:  config.cloudinary.api_secret,
});

const categoryController = {}; // Objeto donde se guardarán todos los métodos del controlador.

/*
  GET: Obtener todas las categorías.
  - Busca todas las categorías en la base de datos.
  - Las ordena alfabéticamente por nombre (ascendente).
*/
categoryController.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 }); // 1 = orden ascendente
    res.status(200).json({ categories });
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ message: "Server error fetching categories" });
  }
};

/*
  GET ONE: Obtener una categoría por su ID.
*/
categoryController.getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id); // Busca por el ID recibido en la URL.
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.status(200).json({ category });
  } catch (error) {
    console.error("Error fetching category:", error);
    res.status(500).json({ message: "Server error fetching category" });
  }
};

/*
  POST: Crear una nueva categoría.
  - Valida que nombre, descripción e imagen sean obligatorios.
  - Evita que haya dos categorías con el mismo nombre.
  - Guarda la categoría en la base de datos.
*/
categoryController.createCategory = async (req, res) => {
  const { name, description, image } = req.body;

  try {
    // Validaciones de campos obligatorios
    if (!name || !name.trim()) {
      return res.status(400).json({ message: "Category name is required" });
    }
    if (!description || !description.trim()) {
      return res.status(400).json({ message: "Category description is required" });
    }
    if (!image || !image.trim()) {
      return res.status(400).json({ message: "Category image URL is required" });
    }

    // Evitar duplicados
    const existing = await Category.findOne({ name: name.trim() });
    if (existing) {
      return res.status(400).json({ message: "A category with that name already exists" });
    }

    // Crear y guardar nueva categoría
    const newCategory = new Category({
      name: name.trim(),
      description: description.trim(),
      image: image.trim(),
    });

    const savedCategory = await newCategory.save();

    res.status(201).json({
      message: "Category created successfully",
      category: savedCategory,
    });
  } catch (error) {
    console.error("Error creating category:", error);
    res.status(500).json({ message: "Server error creating category", error: error.message });
  }
};

/*
  PUT/PATCH: Actualizar una categoría existente.
  - Valida que nombre y descripción sean obligatorios.
  - Evita duplicados de nombre.
  - Si se envía un archivo (req.file), lo sube a Cloudinary.
  - Si se envía image en el body, la usa directamente.
*/
categoryController.updateCategory = async (req, res) => {
  const { name, description } = req.body;

  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Validaciones
    if (!name || !name.trim()) {
      return res.status(400).json({ message: "Category name is required" });
    }
    if (!description || !description.trim()) {
      return res.status(400).json({ message: "Category description is required" });
    }

    // Comprobar duplicados excluyendo la categoría actual
    const duplicate = await Category.findOne({ name: name.trim(), _id: { $ne: req.params.id } });
    if (duplicate) {
      return res.status(400).json({ message: "Another category already has that name" });
    }

    // Actualizar datos básicos
    category.name = name.trim();
    category.description = description.trim();

    // Si llega un archivo, subirlo a Cloudinary
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "categorys",
        allowed_formats: ["png", "jpg", "jpeg", "PNG"],
        transformation: [
          { width: 600, height: 600, crop: "fill" },
          { quality: "auto" }
        ]
      });
      category.image = result.secure_url;
    } 
    // Si llega una URL de imagen directamente
    else if (req.body.image) {
      category.image = req.body.image;
    }

    const updatedCategory = await category.save();

    res.status(200).json({
      message: "Category updated successfully",
      category: updatedCategory
    });
  } catch (error) {
    console.error("Error updating category:", error);
    res.status(500).json({ message: "Server error updating category", error: error.message });
  }
};

/*
  DELETE: Eliminar una categoría por ID.
*/
categoryController.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    await category.deleteOne();

    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).json({ message: "Server error deleting category", error: error.message });
  }
};

export default categoryController;
