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
  SELECT: Obtener todas las categorías
  Ordena por nombre ascendente.
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
  SELECT: Obtener una categoría por ID único.
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
  CREATE: Crear una categoría con nombre, descripción y una imagen obligatoria.
  La imagen se sube a Cloudinary y se guarda su URL pública.
*/
categoryController.createCategory = async (req, res) => {
  const { name, description } = req.body;

  try {
    if (!name || !name.trim()) {
      return res.status(400).json({ message: "Category name is required" });
    }

    if (!description || !description.trim()) {
      return res.status(400).json({ message: "Category description is required" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Category image is required" });
    }

    const existing = await Category.findOne({ name: name.trim() });
    if (existing) {
      return res.status(400).json({ message: "A category with that name already exists" });
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
      name: name.trim(),
      description: description.trim(),
      image: result.secure_url
    });

    const savedCategory = await newCategory.save();

    res.status(201).json({
      message: "Category created successfully",
      category: savedCategory
    });
  } catch (error) {
    console.error("Error creating category:", error);
    res.status(500).json({ message: "Server error creating category", error: error.message });
  }
};

/*
  UPDATE: Actualizar nombre, descripción y/o imagen de una categoría existente.
  Si se envía una nueva imagen, se sube a Cloudinary y se reemplaza.
  Nota: Aquí NO es obligatoria la imagen.
*/
categoryController.updateCategory = async (req, res) => {
  const { name, description } = req.body;

  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    if (!name || !name.trim()) {
      return res.status(400).json({ message: "Category name is required" });
    }

    if (!description || !description.trim()) {
      return res.status(400).json({ message: "Category description is required" });
    }

    const duplicate = await Category.findOne({ name: name.trim(), _id: { $ne: req.params.id } });
    if (duplicate) {
      return res.status(400).json({ message: "Another category already has that name" });
    }

    category.name = name.trim();
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
