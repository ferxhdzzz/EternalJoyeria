import customersModel from "../models/Customers.js";
import bcryptjs from "bcryptjs";
import { v2 as cloudinary } from "cloudinary";

// Configurar Cloudinary
cloudinary.config({
  cloud_name: 'dosy4rouu',
  api_key: '712175425427873',
  api_secret: 'Yk2vqXqQ6aknOrT7FCoqEiWw31w',
});

const customersController = {};

// SELECT (Obtener todos los clientes)
customersController.getcustomers = async (req, res) => {
  try {
    const customers = await customersModel.find();
    res.json(customers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener clientes" });
  }
};

// DELETE (Eliminar cliente por ID)
customersController.deletecustomers = async (req, res) => {
  try {
    // Validación: verificar que el ID sea válido
    if (!req.params.id || req.params.id.trim() === '') {
      return res.status(400).json({ message: "ID del cliente es requerido" });
    }

    const deletedCustomer = await customersModel.findByIdAndDelete(req.params.id);
    if (!deletedCustomer) {
      return res.status(404).json({ message: "Cliente no encontrado" });
    }
    res.json({ message: "Cliente eliminado" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al eliminar cliente" });
  }
};

// UPDATE (Actualizar un cliente)
customersController.updatecustomers = async (req, res) => {
  try {
    // Validación: verificar que el ID sea válido
    if (!req.params.id || req.params.id.trim() === '') {
      return res.status(400).json({ message: "ID del cliente es requerido" });
    }

    const { firstName, lastName, email, password, phone } = req.body;

    // Validación: verificar que al menos un campo esté presente para actualizar
    if (!firstName && !lastName && !email && !password && !phone && !req.file) {
      return res.status(400).json({ message: "Al menos un campo debe ser proporcionado para actualizar" });
    }

    // Validación: verificar formato de email si se proporciona
    if (email && email.trim() !== '') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ message: "Formato de email inválido" });
      }
      
      // Validación de duplicados: verificar que el email no esté registrado por otro cliente
      const existingCustomer = await customersModel.findOne({ 
        email: email, 
        _id: { $ne: req.params.id } // Excluir el cliente actual
      });
      if (existingCustomer) {
        return res.status(400).json({ message: "El email ya está registrado por otro cliente" });
      }
    }

    // Validación: verificar longitud mínima de contraseña si se proporciona
    if (password && password.trim() !== '') {
      if (password.length < 6) {
        return res.status(400).json({ message: "La contraseña debe tener al menos 6 caracteres" });
      }
    }

    // Validación: verificar que nombre y apellido no estén vacíos si se proporcionan
    if (firstName && firstName.trim() === '') {
      return res.status(400).json({ message: "El nombre no puede estar vacío" });
    }
    // Validación: nombres mínimo 2 caracteres, máximo 50
    if (firstName && firstName.trim() !== '') {
      if (firstName.trim().length < 2 || firstName.trim().length > 50) {
        return res.status(400).json({ message: "El nombre debe tener entre 2 y 50 caracteres" });
      }
    }
    
    if (lastName && lastName.trim() === '') {
      return res.status(400).json({ message: "El apellido no puede estar vacío" });
    }
    // Validación: apellidos mínimo 2 caracteres, máximo 50
    if (lastName && lastName.trim() !== '') {
      if (lastName.trim().length < 2 || lastName.trim().length > 50) {
        return res.status(400).json({ message: "El apellido debe tener entre 2 y 50 caracteres" });
      }
    }

    // Validación: verificar formato básico de teléfono si se proporciona
    if (phone && phone.trim() !== '') {
      const phoneRegex = /^[0-9+\-\s()]{8,15}$/;
      if (!phoneRegex.test(phone)) {
        return res.status(400).json({ message: "Formato de teléfono inválido" });
      }
    }

    let updateData = { firstName, lastName, email, phone };

    if (password) {
      const passwordHash = await bcryptjs.hash(password, 10);
      updateData.password = passwordHash;
    }

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

    const updatedClient = await customersModel.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!updatedClient) {
      return res.status(404).json({ message: "Client not found" });
    }

    return res.status(200).json({
      message: "Client updated",
      client: updatedClient
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export default customersController;