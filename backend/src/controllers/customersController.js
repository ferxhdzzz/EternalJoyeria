import customersModel from "../models/Customers.js";
import bcryptjs from "bcryptjs";
import { v2 as cloudinary } from "cloudinary";
import { config } from "../config.js";

// Configurar cloudinary
cloudinary.config({
  cloud_name: config.cloudinary.cloudinary_name,
  api_key: config.cloudinary.cloudinary_api_key,
  api_secret: config.cloudinary.cloudinary_api_secret,
});

const customersController = {};

// SELECT (Obtener todos los clientes)
customersController.getcustomers = async (req, res) => {
  const customers = await customersModel.find();
  res.json(customers);
};

// DELETE (Eliminar cliente por ID)
customersController.deletecustomers = async (req, res) => {
  const deletedCustomer = await customersModel.findByIdAndDelete(req.params.id);
  if (!deletedCustomer) {
    return res.status(404).json({ message: "Cliente no encontrado" });
  }
  res.json({ message: "Cliente eliminado" });
};

// UPDATE (Actualizar un cliente)
customersController.updatecustomers = async (req, res) => {
  try {
    const { firstName, lastName, email, password, phone } = req.body;
    
    // Preparar datos de actualización
    let updateData = { firstName, lastName, email, phone };
    
    // Solo encriptar si se proporciona una nueva contraseña
    if (password) {
      const passwordHash = await bcryptjs.hash(password, 10);
      updateData.password = passwordHash;
    }

    // Manejar la imagen si se proporciona
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "profiles",
        allowed_formats: ["png", "jpg", "jpeg"],
        transformation: [
          { width: 500, height: 500, crop: "fill" },
          { quality: "auto" }
        ]
      });
      updateData.profilePicture = result.secure_url;
    }

    await customersModel.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );
    
    res.json({ message: "Cliente actualizado" });
  } catch (error) {
    console.error("Error actualizando cliente:", error);
    res.status(500).json({ message: "Error del servidor al actualizar cliente" });
  }
};

export default customersController;