//=========================================
///controlador
//==========================
import adminModel from "../models/Administrator.js";
import bcryptjs from "bcryptjs";
import { v2 as cloudinary } from "cloudinary";
import { config } from "../config.js";

// Configuración de Cloudinary
cloudinary.config({
  cloud_name: config.cloudinary.cloudinary_name,
  api_key: config.cloudinary.cloudinary_api_key,
  api_secret: config.cloudinary.cloudinary_api_secret,
});

const adminController = {};

// GET: Obtener todos los administradores
adminController.getadmins = async (req, res) => {
  try {
    const admins = await adminModel.find();
    res.json(admins);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener administradores" });
  }
};

// GET ONE: Obtener administrador por ID
adminController.getadminById = async (req, res) => {
  try {
    const admin = await adminModel.findById(req.params.id);
    if (!admin) {
      return res.status(404).json({ message: "Administrador no encontrado" });
    }
    res.json(admin);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener administrador" });
  }
};

// DELETE: Eliminar administrador por ID
adminController.deleteadmin = async (req, res) => {
  try {
    const deletedAdmin = await adminModel.findByIdAndDelete(req.params.id);
    if (!deletedAdmin) {
      return res.status(404).json({ message: "Administrador no encontrado" });
    }
    res.json({ message: "Administrador eliminado correctamente" });
  } catch (error) {
    console.error(error); b   
    res.status(500).json({ message: "Error al eliminar administrador" });
  }
};

// UPDATE: Actualizar un administrador
adminController.updateadmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    let updateData = { name, email };

    if (password) {
      const hashedPassword = await bcryptjs.hash(password, 10);
      updateData.password = hashedPassword;
    }

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "profiles",
        allowed_formats: ["png", "jpg", "jpeg"],
        transformation: [
          { width: 500, height: 500, crop: "fill" },
          { quality: "auto" },
        ],
      });
      updateData.profilePicture = result.secure_url;
    }

    const updatedAdmin = await adminModel.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!updatedAdmin) {
      return res.status(404).json({ message: "Administrador no encontrado" });
    }

    res.status(200).json({ message: "Administrador actualizado", admin: updatedAdmin });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al actualizar administrador" });
  }
};

export default adminController;