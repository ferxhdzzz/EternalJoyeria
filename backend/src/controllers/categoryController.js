// backend/src/controllers/categoryController.js
import mongoose from "mongoose";
import Category from "../models/Category.js";

/**
 * getAllCategories: Fetches all categories, sorted by name ascending.
 * Route: GET /api/categories
 * Access: Public
 */
export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    return res.status(200).json({ categories });
  } catch (err) {
    console.error("❌ Error in getAllCategories:", err);
    return res.status(500).json({ message: "Server error while fetching categories." });
  }
};

/**
 * getCategoryById: Fetches a single category by its ID.
 * Route: GET /api/categories/:id
 * Access: Public
 */
export const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate that 'id' is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid category ID." });
    }

    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ message: "Category not found." });
    }

    return res.status(200).json({ category });
  } catch (err) {
    console.error("❌ Error in getCategoryById:", err);
    return res.status(500).json({ message: "Server error while fetching category." });
  }
};

/**
 * createCategory: Creates a new category.
 * Route: POST /api/categories
 * Access: Private (admin only)
 */
export const createCategory = async (req, res) => {
  try {
    const { name } = req.body;

    // Validate that 'name' exists and is not empty
    if (!name || !name.trim()) {
      return res.status(400).json({ message: "Category name is required." });
    }

    // Check for duplicate category name
    const existing = await Category.findOne({ name: name.trim() });
    if (existing) {
      return res.status(400).json({ message: "A category with that name already exists." });
    }

    const newCategory = new Category({ name: name.trim() });
    const savedCategory = await newCategory.save();

    return res.status(201).json({
      message: "Category created successfully.",
      category: savedCategory
    });
  } catch (err) {
    console.error("❌ Error in createCategory:", err);
    // If we hit a unique index error (duplicate key), Mongoose error.code === 11000
    if (err.code === 11000) {
      return res.status(400).json({ message: "Category name already in use." });
    }
    return res.status(500).json({ message: "Server error while creating category." });
  }
};

/**
 * updateCategory: Updates an existing category’s name.
 * Route: PUT /api/categories/:id
 * Access: Private (admin only)
 */
export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    // Validate ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid category ID." });
    }

    // Validate new name
    if (!name || !name.trim()) {
      return res.status(400).json({ message: "Category name is required." });
    }

    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ message: "Category not found." });
    }

    // Ensure no other category has the same name
    const other = await Category.findOne({ name: name.trim(), _id: { $ne: id } });
    if (other) {
      return res.status(400).json({ message: "Another category already has that name." });
    }

    // Update and save
    category.name = name.trim();
    const updatedCategory = await category.save();

    return res.status(200).json({
      message: "Category updated successfully.",
      category: updatedCategory
    });
  } catch (err) {
    console.error("❌ Error in updateCategory:", err);
    return res.status(500).json({ message: "Server error while updating category." });
  }
};

/**
 * deleteCategory: Deletes a category by ID.
 * Route: DELETE /api/categories/:id
 * Access: Private (admin only)
 */
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid category ID." });
    }

    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ message: "Category not found." });
    }

    // Delete and respond
    await category.deleteOne();
    return res.status(200).json({ message: "Category deleted successfully." });
  } catch (err) {
    console.error("❌ Error in deleteCategory:", err);
    return res.status(500).json({ message: "Server error while deleting category." });
  }
};
