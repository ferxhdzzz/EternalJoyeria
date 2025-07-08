//=========================================
///controlador
//==========================
import adminModel from "../models/Administrator.js";
import bcryptjs from "bcryptjs";
import { v2 as cloudinary } from "cloudinary";
import jsonwebtoken from "jsonwebtoken";
import { config } from "../config.js";


// Configurar Cloudinary

cloudinary.config({
  cloud_name: 'dosy4rouu',
  api_key: '712175425427873',
  api_secret: 'Yk2vqXqQ6aknOrT7FCoqEiWw31w',
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

adminController.updateCurrentAdmin = async (req, res) => {
  try {
    console.log("Sesión del usuariossssssss:", req.userId);

    const token = req.cookies.authToken;

    if (!token) {
      return res.status(400).json({ message: "No se encontró token de recuperación." });
    }

    const decoded = jsonwebtoken.verify(token, config.JWT.JWT_SECRET);




    const adminId = decoded.id;


    if (!adminId) {
      return res.status(401).json({ message: "No autenticado" });
    }

    const { name, email, password } = req.body;
    let updateData = {};

    if (name !== undefined) {
      if (name.trim() === "") {
        return res.status(400).json({ message: "El nombre no puede estar vacío" });
      }
      updateData.name = name.trim();
    }

    if (email !== undefined) {
      if (email.trim() === "") {
        return res.status(400).json({ message: "El correo no puede estar vacío" });
      }
      // Validación básica email con regex simple
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ message: "Formato de correo inválido" });
      }
      updateData.email = email.trim();
    }

    if (password !== undefined && password.trim() !== "") {
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

    const updatedAdmin = await adminModel.findByIdAndUpdate(adminId, updateData, { new: true });

    if (!updatedAdmin) {
      return res.status(404).json({ message: "Administrador no encontrado" });
    }

    res.status(200).json({ message: "Perfil actualizado", admin: updatedAdmin });
  } catch (error) {
    console.error("Error al actualizar perfil admin:", error);
    res.status(500).json({ message: "Error al actualizar perfil del administrador" });
  }
};


adminController.getCurrentAdmin = async (req, res) => {
  try {
        console.log("Sesión del usuario:", req.session.userId);

    const userId = req.userId; // Este viene del middleware validateAuthToken

    if (!userId) {
      return res.status(401).json({ message: "No autenticado" });
    }

    const admin = await adminModel.findById(userId);

    if (!admin) {
      return res.status(404).json({ message: "Administrador no encontrado" });
    }

    res.json(admin);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener datos del administrador" });
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

    // Validaciones básicas
    if (!name || name.trim() === "") {
      return res.status(400).json({ message: "El nombre no puede estar vacío" });
    }
    if (!email || email.trim() === "") {
      return res.status(400).json({ message: "El correo no puede estar vacío" });
    }
    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: "Formato de correo inválido" });
    }

    let updateData = { name: name.trim(), email: email.trim() };

    if (password && password.trim() !== "") {
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