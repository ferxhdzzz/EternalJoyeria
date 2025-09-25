import Product from "../models/Products.js";
import Category from "../models/Category.js";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs/promises";

// configuración de cloudinary
cloudinary.config({
  cloud_name: 'dosy4rouu',
  api_key: '712175425427873',
  api_secret: 'Yk2vqXqQ6aknOrT7FCoqEiWw31w',
});

const productController = {};

/* Utilidades */
const parseBool = (v) => v === true || v === "true" || v === 1 || v === "1";

/** Clausula que oculta productos marcados como defectuosos/deteriorados */
const hideFlaggedClause = () => ({
  $and: [
    // 1) No tener flag true
    { $or: [{ isDefectiveOrDeteriorated: { $ne: true } }, { isDefectiveOrDeteriorated: { $exists: false } }] },
    // 2) condition ausente o OK
    { $or: [{ condition: { $exists: false } }, { condition: { $in: [null, "", "OK", "Ok", "ok"] } }] },
  ],
});

// obtener todos los productos (con filtro opcional para público)
productController.getAllProducts = async (req, res) => {
  try {
    const { hideFlagged } = req.query;
    const filter = {};

    if (hideFlagged === "true") {
      // Aplica el filtro de ocultar marcados
      Object.assign(filter, hideFlaggedClause());
    }

    // Log de diagnóstico (puedes dejarlo un rato)
    console.log("[getAllProducts] query:", req.query, "filter:", JSON.stringify(filter));

    const products = await Product.find(filter).populate("category_id", "name");
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "error fetching products", error: error.message });
  }
};

// obtener un producto por id
productController.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("category_id", "name");
    if (!product) return res.status(404).json({ message: "product not found" });
    res.json(product);
  } catch (error) {
    res.status(400).json({ message: "error fetching product", error: error.message });
  }
};

// obtener productos por categoría (acepta hideFlagged=true también)
productController.getProductsByCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const { hideFlagged } = req.query;

    const base = { category_id: categoryId };
    const filter =
      hideFlagged === "true"
        ? { $and: [base, hideFlaggedClause()] }
        : base;

    console.log("[getProductsByCategory] query:", req.query, "filter:", JSON.stringify(filter));

    const products = await Product.find(filter).populate("category_id", "name");
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "error fetching products by category", error: error.message });
  }
};

// crear un producto
productController.createProduct = async (req, res) => {
  const {
    name,
    description,
    price,
    measurements,
    category_id,
    discountPercentage,
    stock,
    // opcionalmente podrías enviar estos desde el admin:
    isDefectiveOrDeteriorated,
    defectType,
    defectNote,
    condition,
  } = req.body;

  try {
    if (!name || !name.trim() || !description || price == null || !category_id) {
      return res.status(400).json({ message: "missing required product fields" });
    }

    if (isNaN(price) || Number(price) <= 0) {
      return res.status(400).json({ message: "price must be a valid number greater than 0" });
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
      price: Number(price),
      images: uploadedImages,
      measurements: measurements ? JSON.parse(measurements) : {},
      category_id,
      discountPercentage: discountPercentage != null ? discountPercentage : null,
      finalPrice: calculateFinalPrice(Number(price), discountPercentage),
      stock: stock ?? 1,
    });

    // Sincroniza estado si viene marcado al crear
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

// actualizar un producto (merge imágenes + campos defectuoso/deteriorado)
productController.updateProduct = async (req, res) => {
  const { id } = req.params;
  const updates = { ...req.body };

  try {
    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: "product not found" });

    if (updates.price !== undefined) {
      if (isNaN(updates.price) || Number(updates.price) <= 0) {
        return res.status(400).json({ message: "price must be a valid number greater than 0" });
      }
      updates.price = Number(updates.price);
    }

    if (updates.category_name) {
      const category = await Category.findOne({ name: updates.category_name.trim() });
      if (!category) {
        return res.status(400).json({ message: "category name not found" });
      }
      updates.category_id = category._id;
      delete updates.category_name;
    }

    if (updates.measurements && typeof updates.measurements === "string") {
      try { updates.measurements = JSON.parse(updates.measurements); } catch {}
    }

    // ====== MERGE DE IMÁGENES ======
    let baseImages = Array.isArray(product.images) ? [...product.images] : [];
    if (typeof updates.existingImages === "string") {
      try {
        const parsed = JSON.parse(updates.existingImages);
        if (Array.isArray(parsed)) baseImages = parsed;
      } catch {}
      delete updates.existingImages;
    }

    if (req.files && req.files.length > 0) {
      const uploadedImages = [];
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
      product.images = [...baseImages, ...uploadedImages];
    } else {
      product.images = baseImages;
    }
    // ===============================

    // ====== SINCRONÍA DE ESTADO ======
    // A) Si viene el flag booleano
    if (typeof updates.isDefectiveOrDeteriorated !== "undefined") {
      const flag = parseBool(updates.isDefectiveOrDeteriorated);
      if (flag) {
        const type = updates.defectType || "defective";
        product.isDefectiveOrDeteriorated = true;
        product.defectType = type;
        product.defectNote = updates.defectNote || "";
        product.defectMarkedAt = new Date();
        product.condition = type === "deteriorated" ? "DETERIORADO" : "DEFECTUOSO";
      } else {
        product.isDefectiveOrDeteriorated = false;
        product.defectType = null;
        product.defectNote = "";
        product.defectMarkedAt = null;
        product.condition = "OK";
      }
      delete updates.isDefectiveOrDeteriorated;
      delete updates.defectType;
      delete updates.defectNote;
    }

    // B) Si viene "condition" (compatibilidad con tu rama)
    if (typeof updates.condition !== "undefined") {
      const cond = String(updates.condition || "").toUpperCase();
      if (cond === "DEFECTUOSO" || cond === "DETERIORADO") {
        product.isDefectiveOrDeteriorated = true;
        product.defectType = cond === "DETERIORADO" ? "deteriorated" : "defective";
        product.defectNote = updates.defectNote || product.defectNote || "";
        product.defectMarkedAt = new Date();
        product.condition = cond;
      } else {
        // Cualquier otra cosa lo dejamos como OK
        product.isDefectiveOrDeteriorated = false;
        product.defectType = null;
        product.defectNote = "";
        product.defectMarkedAt = null;
        product.condition = "OK";
      }
      delete updates.condition;
      delete updates.defectNote;
    }
    // =================================

    // aplicar resto de actualizaciones (excepto imágenes, ya manejado)
    Object.keys(updates).forEach(key => {
      if (key !== "images") {
        product[key] = updates[key];
      }
    });

    // recalcular precio final
    product.finalPrice = calculateFinalPrice(product.price, product.discountPercentage);

    const updatedProduct = await product.save();
    const populatedProduct = await Product.findById(updatedProduct._id).populate("category_id", "name");
    res.status(200).json(populatedProduct);

  } catch (error) {
    res.status(500).json({ message: "error updating product", error: error.message });
  }
};

// eliminar un producto
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

// función para calcular precio final con descuento
function calculateFinalPrice(price, discountPercentage) {
  if (discountPercentage && discountPercentage > 0 && discountPercentage < 100) {
    return Number((price - (price * discountPercentage) / 100).toFixed(2));
  }
  return price;
}

export default productController;
