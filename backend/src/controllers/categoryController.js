import Category from "../models/Category.js";
import { v2 as cloudinary } from "cloudinary";

// Configurar Cloudinary
cloudinary.config({
  cloud_name: 'dosy4rouu',
  api_key: '712175425427873',
  api_secret: 'Yk2vqXqQ6aknOrT7FCoqEiWw31w',
});

const categoryController = {};

/*
  SELECT: Obtener todas las categorías ordenadas por nombre ASC.
*/
categoryController.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.status(200).json({ categories });
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ message: "Server error fetching categories" });
  }
};

/*
  SELECT: Obtener una categoría por ID.
*/
categoryController.getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
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
  CREATE: Crear una categoría con validaciones robustas.
*/
categoryController.createCategory = async (req, res) => {
  const { name, description } = req.body;

  try {
    if (!name || !name.trim()) {
      return res.status(400).json({ message: "El nombre de la categoría es obligatorio." });
    }

    if (!description || !description.trim()) {
      return res.status(400).json({ message: "La descripción de la categoría es obligatoria." });
    }

    if (!req.file) {
      return res.status(400).json({ message: "La imagen de la categoría es obligatoria." });
    }

    const nameTrimmed = name.trim();

    const existing = await Category.findOne({ name: nameTrimmed });
    if (existing) {
      return res.status(400).json({ message: "Ya existe una categoría con este nombre." });
    }

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "categorys",
      allowed_formats: ["png", "jpg", "jpeg"],
      transformation: [
        { width: 600, height: 600, crop: "fill" },
        { quality: "auto" }
      ]
    });

    const newCategory = new Category({
      name: nameTrimmed,
      description: description.trim(),
      image: result.secure_url
    });

    const savedCategory = await newCategory.save();

    res.status(201).json({
      message: "Categoría creada correctamente.",
      category: savedCategory
    });
  } catch (error) {
    console.error("Error creating category:", error);
    res.status(500).json({ message: "Error del servidor al crear la categoría.", error: error.message });
  }
};

/*
  UPDATE: Actualizar una categoría con validaciones.
*/
categoryController.updateCategory = async (req, res) => {
  const { name, description } = req.body;

  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Categoría no encontrada." });
    }

    if (!name || !name.trim()) {
      return res.status(400).json({ message: "El nombre de la categoría es obligatorio." });
    }

    if (!description || !description.trim()) {
      return res.status(400).json({ message: "La descripción de la categoría es obligatoria." });
    }

    const nameTrimmed = name.trim();

    const duplicate = await Category.findOne({ name: nameTrimmed, _id: { $ne: req.params.id } });
    if (duplicate) {
      return res.status(400).json({ message: "Ya existe otra categoría con ese nombre." });
    }

    category.name = nameTrimmed;
    category.description = description.trim();

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "categorys",
        allowed_formats: ["png", "jpg", "jpeg"],
        transformation: [
          { width: 600, height: 600, crop: "fill" },
          { quality: "auto" }
        ]
      });
      category.image = result.secure_url;
    }

    const updatedCategory = await category.save();

    res.status(200).json({
      message: "Categoría actualizada correctamente.",
      category: updatedCategory
    });
  } catch (error) {
    console.error("Error updating category:", error);
    res.status(500).json({ message: "Error del servidor al actualizar la categoría.", error: error.message });
  }
};

/*
  DELETE: Eliminar una categoría por ID.
*/
categoryController.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Categoría no encontrada." });
    }

    await category.deleteOne();

    res.status(200).json({ message: "Categoría eliminada correctamente." });
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).json({ message: "Error del servidor al eliminar la categoría.", error: error.message });
  }
};

export default categoryController;
