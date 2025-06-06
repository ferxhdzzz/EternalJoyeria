// backend/src/routers/categories.js
import { Router } from "express";
import {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
} from "../controllers/categoryController.js";
import { protect, authorizeAdmin } from "../utils/authMiddleware.js";

const router = Router();

/**
 * GET    /api/categories          → getAllCategories (public)
 * GET    /api/categories/:id      → getCategoryById (public)
 * POST   /api/categories          → createCategory (admin only)
 * PUT    /api/categories/:id      → updateCategory (admin only)
 * DELETE /api/categories/:id      → deleteCategory (admin only)
 */
router.get("/", getAllCategories);
router.get("/:id", getCategoryById);
router.post("/", protect, authorizeAdmin, createCategory);
router.put("/:id", protect, authorizeAdmin, updateCategory);
router.delete("/:id", protect, authorizeAdmin, deleteCategory);

export default router;
