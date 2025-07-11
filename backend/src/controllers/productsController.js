// backend/src/controllers/productController.js
import Product from "../models/Products.js";
import Category from "../models/Category.js";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs/promises";

cloudinary.config({
  cloud_name: 'dosy4rouu',
  api_key: '712175425427873',
  api_secret: 'Yk2vqXqQ6aknOrT7FCoqEiWw31w',
});

const productController = {};

// GET ALL
productController.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate("category_id", "name");
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Error fetching products", error: error.message });
  }
};

// GET BY ID
productController.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("category_id", "name");
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (error) {
    res.status(400).json({ message: "Error fetching product", error: error.message });
  }
};

// CREATE
productController.createProduct = async (req, res) => {
  const {
    name,
    description,
    price,
    measurements,
    category_id,
    discountPercentage,
    stock
  } = req.body;

  try {
    if (!name || !name.trim() || !description || price == null || !category_id) {
      return res.status(400).json({ message: "Missing required product fields" });
    }

    let uploadedImages = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: "products",
          allowed_formats: ["png", "jpg", "jpeg"],
          transformation: [
            { width: 800, height: 800, crop: "fill" },
            { quality: "auto" }
          ]
        });
        uploadedImages.push(result.secure_url);
        await fs.unlink(file.path);
      }
    }

    const newProduct = new Product({
      name: name.trim(),
      description: description.trim(),
      price,
      images: uploadedImages,
      measurements: measurements ? JSON.parse(measurements) : {},
      category_id,
      discountPercentage: discountPercentage != null ? discountPercentage : null,
      finalPrice: calculateFinalPrice(price, discountPercentage),
      stock: stock ?? 1 // si no se envía, usa 1 por defecto
    });

    const savedProduct = await newProduct.save();
    const populatedProduct = await Product.findById(savedProduct._id).populate("category_id", "name");
    res.status(201).json(populatedProduct);
  } catch (error) {
    res.status(500).json({ message: "Error creating product", error: error.message });
  }
};

// UPDATE
productController.updateProduct = async (req, res) => {
  const { id } = req.params;
  const updates = { ...req.body };

  try {
    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    if (updates.category_name) {
      const category = await Category.findOne({ name: updates.category_name.trim() });
      if (!category) {
        return res.status(400).json({ message: "Category name not found" });
      }
      updates.category_id = category._id;
      delete updates.category_name;
    }

    if (updates.measurements && typeof updates.measurements === "string") {
      try {
        updates.measurements = JSON.parse(updates.measurements);
      } catch {
        // ignore invalid JSON
      }
    }

    if (req.files && req.files.length > 0) {
      let uploadedImages = [];
      for (const file of req.files) {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: "products",
          allowed_formats: ["png", "jpg", "jpeg"],
          transformation: [
            { width: 800, height: 800, crop: "fill" },
            { quality: "auto" }
          ]
        });
        uploadedImages.push(result.secure_url);
        await fs.unlink(file.path);
      }
      product.images = uploadedImages;
    }

    Object.keys(updates).forEach(key => {
      if (key !== "images") {
        product[key] = updates[key];
      }
    });

    product.finalPrice = calculateFinalPrice(product.price, product.discountPercentage);

    const updatedProduct = await product.save();
    const populatedProduct = await Product.findById(updatedProduct._id).populate("category_id", "name");
    res.status(200).json(populatedProduct);

  } catch (error) {
    res.status(500).json({ message: "Error updating product", error: error.message });
  }
};

// DELETE
productController.deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    await product.deleteOne();
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting product", error: error.message });
  }
};

function calculateFinalPrice(price, discountPercentage) {
  if (discountPercentage && discountPercentage > 0 && discountPercentage < 100) {
    return Number((price - (price * discountPercentage) / 100).toFixed(2));
  }
  return price;
}

export default productController;
