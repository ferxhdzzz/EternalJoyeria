// backend/src/controllers/productsController.js

import Product from "../models/Products.js";
import Category from "../models/Category.js";
import Order from "../models/Orders.js";
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
    const products = await Product.find().populate("category_id", "name");
    
    // Log temporal para debugging de stock (simplificado)
    console.log(`📋 [PRODUCTS] Devolviendo ${products.length} productos`);
    
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

// obtener productos por categoría
productController.getProductsByCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const products = await Product.find({ category_id: categoryId }).populate("category_id", "name");
    
    // Log temporal para debugging de stock
    console.log(`📋 [PRODUCTS] Devolviendo ${products.length} productos de categoría ${categoryId}`);
    products.forEach(product => {
      console.log(`📦 [PRODUCTS] ${product.name}: stock = ${product.stock}`);
    });
    
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "error fetching products by category", error: error.message });
  }
};

// ENDPOINT TEMPORAL PARA DEBUGGING DE STOCK
productController.checkStock = async (req, res) => {
  try {
    const products = await Product.find({}, 'name stock').lean();
    
    console.log(`🔍 [DEBUG] Verificando stock directo de la base de datos:`);
    const stockInfo = products.map(product => {
      console.log(`🔍 [DEBUG] ${product.name}: ${product.stock}`);
      return {
        id: product._id,
        name: product.name,
        stock: product.stock
      };
    });
    
    res.json({
      message: "Stock actual en la base de datos",
      products: stockInfo,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error checking stock:', error);
    res.status(500).json({ message: "Error checking stock", error: error.message });
  }
};

// Verificar si un usuario ha comprado un producto específico
productController.checkUserPurchase = async (req, res) => {
  try {
    const { productId } = req.params;
    let userId = req.userId; // Viene del middleware de autenticación
    
    console.log(`🛒 [PURCHASE_CHECK] =================================`);
    console.log(`🛒 [PURCHASE_CHECK] Verificando compra - Usuario: ${userId}, Producto: ${productId}`);
    console.log(`🛒 [PURCHASE_CHECK] Headers recibidos:`, JSON.stringify(req.headers, null, 2));
    
    if (!userId) {
      console.log(`❌ [PURCHASE_CHECK] Usuario no autenticado`);
      return res.status(401).json({ 
        success: false, 
        message: "Usuario no autenticado" 
      });
    }
    
    if (!productId) {
      return res.status(400).json({ 
        success: false, 
        message: "ID de producto requerido" 
      });
    }
    
    // Buscar órdenes del usuario que contengan este producto y estén pagadas
    console.log(`🔍 [PURCHASE_CHECK] Buscando órdenes con criterios:`);
    console.log(`🔍 [PURCHASE_CHECK] - idCustomer: ${userId}`);
    console.log(`🔍 [PURCHASE_CHECK] - status: 'pagado'`);
    console.log(`🔍 [PURCHASE_CHECK] - products.productId: ${productId}`);
    
    // Primero, buscar TODAS las órdenes del usuario para debugging
    const allUserOrders = await Order.find({
      idCustomer: userId
    }).populate('products.productId', 'name');
    
    console.log(`📊 [PURCHASE_CHECK] Total órdenes del usuario: ${allUserOrders.length}`);
    
    // Ahora buscar órdenes específicas con el producto
    const orders = await Order.find({
      idCustomer: userId,
      status: 'pagado',
      'products.productId': productId
    }).populate('products.productId', 'name');
    
    console.log(`🛒 [PURCHASE_CHECK] Órdenes encontradas: ${orders.length}`);
    
    // Log simplificado de las órdenes encontradas
    if (orders.length > 0) {
      console.log(`✅ [PURCHASE_CHECK] Usuario SÍ ha comprado el producto (${orders.length} órdenes)`);
    } else {
      console.log(`❌ [PURCHASE_CHECK] Usuario NO ha comprado el producto`);
    }
    
    if (orders.length > 0) {
      // El usuario ha comprado este producto
      const purchaseInfo = orders.map(order => ({
        orderId: order._id,
        purchaseDate: order.createdAt,
        products: order.products.filter(p => p.productId._id.toString() === productId)
      }));
      
      return res.json({
        success: true,
        hasPurchased: true,
        message: "Usuario ha comprado este producto",
        purchases: purchaseInfo
      });
    } else {
      return res.json({
        success: true,
        hasPurchased: false,
        message: "Usuario no ha comprado este producto"
      });
    }
    
  } catch (error) {
    console.error('❌ [PURCHASE_CHECK] Error:', error);
    res.status(500).json({ 
      success: false, 
      message: "Error al verificar compra", 
      error: error.message 
    });
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
    stock
  } = req.body;

  try {
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
      discountPercentage: discountPercentage != null ? discountPercentage : null,
      finalPrice: calculateFinalPrice(Number(price), discountPercentage),
      stock: stock ?? 1
    });

    // guardar en la base de datos
    const savedProduct = await newProduct.save();
    const populatedProduct = await Product.findById(savedProduct._id).populate("category_id", "name");
    res.status(201).json(populatedProduct);
  } catch (error) {
    res.status(500).json({ message: "error creating product", error: error.message });
  }
};

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

    // subir nuevas imágenes si se envían
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
