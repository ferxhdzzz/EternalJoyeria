//=========================================
///controlador
//==========================
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
    const { firstName, lastName, email, password, phone } = req.body;

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

    return res.status(200).json({ message: "Client updated", client: updatedClient });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export default customersController;