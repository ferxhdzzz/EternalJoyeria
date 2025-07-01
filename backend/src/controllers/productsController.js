// Importar dependencias
import Product from "../models/Products.js";
import { v2 as cloudinary } from "cloudinary";
// Configurar Cloudinary
cloudinary.config({
  cloud_name: 'dosy4rouu',
  api_key: '712175425427873',
  api_secret: 'Yk2vqXqQ6aknOrT7FCoqEiWw31w',
});

// Crear objeto para contener todos los métodos del controlador
const productController = {};

/*
  SELECT: Obtener todos los productos
  Este método busca todos los productos en la base de datos
  y agrega la información de la categoría relacionada usando populate.
*/
productController.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate("category_id");
    res.json(products);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching products",
      error: error.message
    });
  }
};

/*
  SELECT: Obtener un producto específico
  Este método busca un producto por su ID único y agrega la información
  de la categoría relacionada usando populate.
*/
productController.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("category_id");

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    res.status(400).json({
      message: "Error fetching product",
      error: error.message
    });
  }
};

/*
  CREATE: Crear un nuevo producto
  Este método recibe los datos del producto y las imágenes
  desde un formulario tipo multipart/form-data. Las imágenes se suben a Cloudinary
  y se guarda la URL pública en el array de imágenes del producto.
*/
productController.createProduct = async (req, res) => {
  const {
    name,
    description,
    price,
    measurements,
    category_id,
    discountPercentage
  } = req.body;

  try {
    // Validar campos obligatorios
    if (!name || !name.trim() || !description || price == null || !category_id) {
      return res.status(400).json({ message: "Missing required product fields" });
    }

    // Subir imágenes a Cloudinary (si hay archivos)
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
        await fs.unlink(file.path); // Eliminar archivo temporal
      }
    }

    // Crear nueva instancia de producto
    const newProduct = new Product({
      name: name.trim(),
      description: description.trim(),
      price,
      images: uploadedImages,
      measurements: measurements || {},
      category_id,
      discountPercentage: discountPercentage != null ? discountPercentage : null,
      finalPrice: calculateFinalPrice(price, discountPercentage)
    });

    // Guardar producto en la base de datos
    const savedProduct = await newProduct.save();

    // Poblar categoría y enviar respuesta
    const populatedProduct = await Product.findById(savedProduct._id).populate("category_id");

    res.status(201).json(populatedProduct);
  } catch (error) {
    res.status(500).json({
      message: "Error creating product",
      error: error.message
    });
  }
};

/*
  UPDATE: Actualizar un producto
  Este método actualiza un producto existente, permitiendo subir nuevas imágenes
  que se cargan a Cloudinary. Se recalcula el precio final y se devuelve el producto
  actualizado con la información de la categoría relacionada.
*/
productController.updateProduct = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Subir nuevas imágenes si se envían
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

    // Actualizar otros campos
    Object.keys(updates).forEach(key => {
      if (key !== "images") {
        product[key] = updates[key];
      }
    });

    if (product.price != null) {
      product.finalPrice = calculateFinalPrice(product.price, product.discountPercentage);
    }

    const updatedProduct = await product.save();

    const populatedProduct = await Product.findById(updatedProduct._id).populate("category_id");

    res.status(200).json(populatedProduct);
  } catch (error) {
    res.status(500).json({
      message: "Error updating product",
      error: error.message
    });
  }
};

/*
  DELETE: Eliminar un producto
  Este método elimina un producto de la base de datos por su ID único.
*/
productController.deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    await product.deleteOne();

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting product",
      error: error.message
    });
  }
};

/*
  Función utilitaria: Calcular precio final
*/
function calculateFinalPrice(price, discountPercentage) {
  if (discountPercentage && discountPercentage > 0 && discountPercentage <= 100) {
    return price - (price * (discountPercentage / 100));
  }
  return price;
}

export default productController;
