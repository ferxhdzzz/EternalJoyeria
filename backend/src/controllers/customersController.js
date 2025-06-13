import customersModel from "../models/Customers.js";

import bcryptjs from "bcryptjs";


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
//Antes de Actualizar los datos necesito que se encripte la Contra
  const { firstName, lastName, email, password, phone } = req.body;
// Encriptar la contraseña
const passwordHash = await bcryptjs.hash(password, 10);


  await customersModel.findByIdAndUpdate(
    req.params.id,
    { firstName,
      lastName,
     email, 
     password: passwordHash, 
     phone
    },
    { new: true }
  );
  
  res.json({ message: "Cliente actualizado" });
};

export default customersController;
