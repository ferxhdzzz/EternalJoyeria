import CustomersModel from "../models/Customers.js";
import jwt from "jsonwebtoken";
import { config } from "../config.js";
import bcryptjs from "bcryptjs";
import cloudinary from "../utils/cloudinary.js"; // Ajusta según tu setup

const customersController = {};

/**
 * Obtener el perfil del cliente autenticado (/me)
 */
customersController.getCurrentCustomer = async (req, res) => {
  try {
    const customer = await CustomersModel.findById(req.userId).select("-password");
    if (!customer) return res.status(404).json({ message: "Cliente no encontrado" });

    res.json({ success: true, customer });
  } catch (error) {
    console.error("Error getCurrentCustomer:", error);
    res.status(500).json({ message: "Error obteniendo perfil", error: error.message });
  }
};

/**
 * Actualizar el perfil del cliente autenticado (/me)
 */
customersController.updateCurrentCustomer = async (req, res) => {
  try {
    const updateData = { ...req.body };

    // Si se envía un archivo de imagen
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      updateData.profilePicture = result.secure_url;
    }

    const updatedCustomer = await CustomersModel.findByIdAndUpdate(
      req.userId,
      updateData,
      { new: true }
    ).select("-password");

    if (!updatedCustomer) return res.status(404).json({ message: "Cliente no encontrado" });
    res.json(updatedCustomer);
  } catch (error) {
    console.error("Error en updateCurrentCustomer:", error);
    res.status(500).json({ message: "Error actualizando perfil", error: error.message });
  }
};

/**
 * Renovar token JWT y actualizar cookie (/refresh-token)
 */
customersController.refreshToken = async (req, res) => {
  try {
    const customer = await CustomersModel.findById(req.userId);
    if (!customer) return res.status(404).json({ message: "Cliente no encontrado" });

    const token = jwt.sign(
      { id: customer._id, userType: "customer" },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn }
    );

    res.cookie("authToken", token, {
      httpOnly: true,
      secure: true, // obligatorio en Render/Vercel
      sameSite: "none",
      path: "/",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.json({ message: "Token renovado", token });
  } catch (error) {
    console.error("Error en refreshToken:", error);
    res.status(500).json({ message: "Error renovando token", error: error.message });
  }
};

/**
 * Test de subida a Cloudinary
 */
customersController.testCloudinary = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "Archivo no proporcionado" });
    const result = await cloudinary.uploader.upload(req.file.path);
    res.json({ url: result.secure_url });
  } catch (error) {
    console.error("Error testCloudinary:", error);
    res.status(500).json({ message: "Error subiendo archivo", error: error.message });
  }
};

/**
 * Otras funciones de clientes
 */
customersController.getcustomers = async (req, res) => {
  try {
    const customers = await CustomersModel.find().select("-password");
    res.json(customers);
  } catch (error) {
    console.error("Error en getcustomers:", error);
    res.status(500).json({ message: "Error obteniendo clientes", error: error.message });
  }
};

customersController.getCustomerById = async (req, res) => {
  try {
    const customer = await CustomersModel.findById(req.params.id).select("-password");
    if (!customer) return res.status(404).json({ message: "Cliente no encontrado" });
    res.json(customer);
  } catch (error) {
    console.error("Error en getCustomerById:", error);
    res.status(500).json({ message: "Error obteniendo cliente", error: error.message });
  }
};

customersController.updatecustomers = async (req, res) => {
  try {
    const updateData = { ...req.body };
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      updateData.profilePicture = result.secure_url;
    }

    const updatedCustomer = await CustomersModel.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).select("-password");

    if (!updatedCustomer) return res.status(404).json({ message: "Cliente no encontrado" });
    res.json(updatedCustomer);
  } catch (error) {
    console.error("Error en updatecustomers:", error);
    res.status(500).json({ message: "Error actualizando cliente", error: error.message });
  }
};

customersController.deletecustomers = async (req, res) => {
  try {
    const deleted = await CustomersModel.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Cliente no encontrado" });
    res.json({ message: "Cliente eliminado correctamente" });
  } catch (error) {
    console.error("Error en deletecustomers:", error);
    res.status(500).json({ message: "Error eliminando cliente", error: error.message });
  }
};

export default customersController;
