// backend/src/controllers/productController.js
import Product from "../models/Products.js";

const productController = {};

// GET /api/products
productController.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ name: 1 });
    return res.status(200).json({ products });
  } catch (error) {
    console.error("Error al obtener productos:", error);
    return res.status(500).json({ message: "Server error fetching products" });
  }
};

// GET /api/products/:id
productController.getProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    return res.status(200).json({ product });
  } catch (error) {
    console.error("Error al obtener producto:", error);
    return res.status(500).json({ message: "Server error fetching product" });
  }
};

// POST /api/products
productController.createProduct = async (req, res) => {
  const {
    name,
    description,
    price,
    images,
    measurements,
    category_id,
    discountPercentage
  } = req.body;

  try {
    if (!name || !name.trim() || !description || price == null || !category_id) {
      return res.status(400).json({ message: "Missing required product fields" });
    }

    const newProduct = new Product({
      name: name.trim(),
      description: description.trim(),
      price,
      images: images || [],
      measurements: measurements || {},
      category_id,
      discountPercentage: discountPercentage != null ? discountPercentage : null
    });

    const savedProduct = await newProduct.save();
    return res.status(201).json({
      message: "Product created successfully",
      product: savedProduct
    });
  } catch (error) {
    console.error("Error al crear producto:", error);
    return res.status(500).json({ message: "Server error creating product" });
  }
};

// PUT /api/products/:id
productController.updateProduct = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    Object.keys(updates).forEach(key => {
      product[key] = updates[key];
    });

    const updatedProduct = await product.save();
    return res.status(200).json({
      message: "Product updated successfully",
      product: updatedProduct
    });
  } catch (error) {
    console.error("Error al actualizar producto:", error);
    return res.status(500).json({ message: "Server error updating product" });
  }
};

// DELETE /api/products/:id
productController.deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    await product.deleteOne();
    return res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error al eliminar producto:", error);
    return res.status(500).json({ message: "Server error deleting product" });
  }
};

export default productController;
