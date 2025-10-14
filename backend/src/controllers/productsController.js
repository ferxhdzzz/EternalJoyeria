// backend/src/controllers/productsController.js
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

const parseBool = (v) => v === true || v === "true" || v === 1 || v === "1";

const hideFlaggedClause = () => ({
  $or: [{ isDefectiveOrDeteriorated: { $ne: true } }, { isDefectiveOrDeteriorated: { $exists: false } }],
});

productController.getAllProducts = async (req, res) => {
  try {
    const filter = req.query.hideFlagged === "true" ? hideFlaggedClause() : {};
    const products = await Product.find(filter).populate("category_id", "name");
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "error fetching products", error: error.message });
  }
};

productController.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("category_id", "name");
    if (!product) return res.status(404).json({ message: "product not found" });
    res.json(product);
  } catch (error) {
    res.status(400).json({ message: "error fetching product", error: error.message });
  }
};

productController.getProductsByCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const filter = req.query.hideFlagged === "true" 
      ? { $and: [{ category_id: categoryId }, hideFlaggedClause()] } 
      : { category_id: categoryId };
    const products = await Product.find(filter).populate("category_id", "name");
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "error fetching products by category", error: error.message });
  }
};

function calculateFinalPrice(price, discountPercentage) {
  if (discountPercentage && discountPercentage > 0 && discountPercentage < 100) {
    return Number((price - (price * discountPercentage) / 100).toFixed(2));
  }
  return Number(price);
}

productController.createProduct = async (req, res) => {
  const { name, description, price, measurements, category_id, discountPercentage, stock, condition, isDefectiveOrDeteriorated, defectType, defectNote } = req.body;
  try {
    if (!name || !description || price == null || !category_id) {
      return res.status(400).json({ message: "missing required fields" });
    }
    let uploadedImages = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const result = await cloudinary.uploader.upload(file.path, { folder: "products" });
        uploadedImages.push(result.secure_url);
        await fs.unlink(file.path);
      }
    }
    const newProduct = new Product({
      name: name.trim(),
      description: description.trim(),
      price: Number(price),
      images: uploadedImages,
      measurements: measurements ? JSON.parse(measurements) : {},
      category_id,
      discountPercentage: discountPercentage != null ? discountPercentage : null,
      finalPrice: calculateFinalPrice(Number(price), discountPercentage),
      stock: stock ?? 1,
    });
    const flag = parseBool(isDefectiveOrDeteriorated);
    if (flag || (condition && String(condition).toUpperCase() !== "OK")) {
      const type = defectType || (String(condition).toUpperCase() === "DETERIORADO" ? "deteriorated" : "defective");
      newProduct.isDefectiveOrDeteriorated = true;
      newProduct.defectType = type;
      newProduct.defectNote = defectNote || "";
      newProduct.defectMarkedAt = new Date();
      newProduct.condition = type === "deteriorated" ? "DETERIORADO" : "DEFECTUOSO";
    } else if (condition) {
      newProduct.condition = "OK";
    }
    const savedProduct = await newProduct.save();
    const populatedProduct = await Product.findById(savedProduct._id).populate("category_id", "name");
    res.status(201).json(populatedProduct);
  } catch (error) {
    res.status(500).json({ message: "error creating product", error: error.message });
  }
};

productController.updateProduct = async (req, res) => {
  const { id } = req.params;
  const updates = { ...req.body };
  try {
    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: "product not found" });

    if (updates.measurements && typeof updates.measurements === "string") {
      try { updates.measurements = JSON.parse(updates.measurements); } catch {}
    }

    let baseImages = updates.existingImages ? JSON.parse(updates.existingImages) : (Array.isArray(product.images) ? [...product.images] : []);
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const result = await cloudinary.uploader.upload(file.path, { folder: "products" });
        baseImages.push(result.secure_url);
        await fs.unlink(file.path);
      }
    }
    product.images = baseImages;
    delete updates.existingImages;
    
    if (typeof updates.isDefectiveOrDeteriorated !== "undefined") {
      const flag = parseBool(updates.isDefectiveOrDeteriorated);
      if (flag) {
        product.isDefectiveOrDeteriorated = true;
        product.defectType = updates.defectType || "defective";
        product.defectNote = updates.defectNote || "";
        product.defectMarkedAt = new Date();
        product.condition = updates.condition || (updates.defectType === "deteriorated" ? "DETERIORADO" : "DEFECTUOSO");
      } else {
        product.isDefectiveOrDeteriorated = false;
        product.defectType = null;
        product.defectNote = "";
        product.defectMarkedAt = null;
        product.condition = "OK";
      }
    }

    Object.keys(updates).forEach(key => {
        if (!["images", "isDefectiveOrDeteriorated", "defectType", "defectNote", "defectMarkedAt", "condition"].includes(key)) {
            product[key] = updates[key];
        }
    });

    product.finalPrice = calculateFinalPrice(product.price, product.discountPercentage);
    const updatedProduct = await product.save();
    const populatedProduct = await Product.findById(updatedProduct._id).populate("category_id", "name");
    res.status(200).json(populatedProduct);
  } catch (error) {
    res.status(500).json({ message: "error updating product", error: error.message });
  }
};

productController.deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: "product not found" });
    await product.deleteOne();
    res.status(200).json({ message: "product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "error deleting product", error: error.message });
  }
};

export default productController;