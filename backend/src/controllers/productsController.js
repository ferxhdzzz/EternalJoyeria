// backend/src/controllers/productsController.js

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

// obtener todos los productos
productController.getAllProducts = async (req, res) => {
  try {
    const { country } = req.query;

    // 🔹 Si hay country válido, filtrar; si no, traer todos
    let filter = {};
    if (country && ["SV", "US"].includes(country)) {
      filter.country = country;
    }

    const products = await Product.find(filter).populate("category_id", "name");
    res.json({ products });
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

// obtener productos por categoría
productController.getProductsByCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const { country } = req.query;

    let filter = { category_id: categoryId };
    if (country && ["SV", "US"].includes(country)) {
      filter.country = country;
    }

    const products = await Product.find(filter).populate("category_id", "name");
    res.json({ products });
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
    country,
  } = req.body;

  try {

   if (!country || !["SV", "US"].includes(country)) {
      return res.status(400).json({ message: "Country must be SV or US" });
    }


    // validación de campos obligatorios
    if (!name || !name.trim() || !description || price == null || !category_id) {
      return res.status(400).json({ message: "missing required product fields" });
    }

    // validación de precio
    if (isNaN(price) || Number(price) <= 0) {
      return res.status(400).json({ message: "price must be a valid number greater than 0" });
    }

    // subida de imágenes a cloudinary si existen
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

    // creación de la instancia del producto
     const newProduct = new Product({
      name: name.trim(),
      description: description.trim(),
      price: Number(price),
      images: uploadedImages,
      measurements: measurements ? JSON.parse(measurements) : {},
      category_id,
      discountPercentage: discountPercentage ?? null,
      finalPrice: calculateFinalPrice(Number(price), discountPercentage),
      stock: stock ?? 1,
      country, // ← ← ← NUEVO
    });

    const savedProduct = await newProduct.save();
    const populatedProduct = await Product.findById(savedProduct._id).populate("category_id", "name");
    res.status(201).json(populatedProduct);
  } catch (error) {
    res.status(500).json({ message: "error creating product", error: error.message });
  }
};

// actualizar un producto
// actualizar un producto
productController.updateProduct = async (req, res) => {
  const { id } = req.params;
  const updates = { ...req.body };

  try {
    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: "product not found" });

    // validación de precio si viene en el update
    if (updates.price !== undefined) {
      if (isNaN(updates.price) || Number(updates.price) <= 0) {
        return res.status(400).json({ message: "price must be a valid number greater than 0" });
      }
      updates.price = Number(updates.price);
    }

    if (updates.country && ["SV", "US"].includes(updates.country)) {
  product.country = updates.country;
}

    // buscar id de categoría si se envía nombre
    if (updates.category_name) {
      const category = await Category.findOne({ name: updates.category_name.trim() });
      if (!category) {
        return res.status(400).json({ message: "category name not found" });
      }
      updates.category_id = category._id;
      delete updates.category_name;
    }

    // convertir measurements de string a objeto si es necesario
    if (updates.measurements && typeof updates.measurements === "string") {
      try {
        updates.measurements = JSON.parse(updates.measurements);
      } catch {
        // ignorar si el json es inválido
      }
    }

    // obtener imágenes existentes enviadas desde el frontend
    let existingImages = [];
    if (req.body.existingImages) {
      try {
        existingImages = JSON.parse(req.body.existingImages);
      } catch (err) {
        console.error("Error parsing existingImages:", err);
        existingImages = [];
      }
    }

    // subir nuevas imágenes si se envían
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

    // combinar imágenes existentes y nuevas
    product.images = [...existingImages, ...uploadedImages];

    // aplicar actualizaciones excepto imágenes
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
    console.error("Error updating product:", error); // opcional para debugging
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
