// backend/src/controllers/categoryController.js
import Category from "../models/Category.js";

const categoryController = {};

// Obtener todas las categorías (GET /api/categories)
categoryController.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    return res.status(200).json({ categories });
  } catch (error) {
    console.error("Error al obtener categorías:", error);
    return res.status(500).json({ message: "Server error fetching categories" });
  }
};

// Obtener una categoría por ID (GET /api/categories/:id)
categoryController.getCategoryById = async (req, res) => {
  const { id } = req.params;
  try {
    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    return res.status(200).json({ category });
  } catch (error) {
    console.error("Error al obtener categoría:", error);
    return res.status(500).json({ message: "Server error fetching category" });
  }
};

// Crear nueva categoría (POST /api/categories)
categoryController.createCategory = async (req, res) => {
  const { name } = req.body;
  try {
    if (!name || !name.trim()) {
      return res.status(400).json({ message: "Category name is required" });
    }
    const existing = await Category.findOne({ name: name.trim() });
    if (existing) {
      return res.status(400).json({ message: "A category with that name already exists" });
    }
    const newCategory = new Category({ name: name.trim() });
    const savedCategory = await newCategory.save();
    return res.status(201).json({
      message: "Category created successfully",
      category: savedCategory
    });
  } catch (error) {
    console.error("Error al crear categoría:", error);
    return res.status(500).json({ message: "Server error creating category" });
  }
};

// Actualizar nombre de categoría (PUT /api/categories/:id)
categoryController.updateCategory = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  try {
    if (!name || !name.trim()) {
      return res.status(400).json({ message: "Category name is required" });
    }
    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    const duplicate = await Category.findOne({ name: name.trim(), _id: { $ne: id } });
    if (duplicate) {
      return res.status(400).json({ message: "Another category already has that name" });
    }
    category.name = name.trim();
    const updatedCategory = await category.save();
    return res.status(200).json({
      message: "Category updated successfully",
      category: updatedCategory
    });
  } catch (error) {
    console.error("Error al actualizar categoría:", error);
    return res.status(500).json({ message: "Server error updating category" });
  }
};

// Eliminar categoría por ID (DELETE /api/categories/:id)
categoryController.deleteCategory = async (req, res) => {
  const { id } = req.params;
  try {
    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    await category.deleteOne();
    return res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error("Error al eliminar categoría:", error);
    return res.status(500).json({ message: "Server error deleting category" });
  }
};

export default categoryController;
