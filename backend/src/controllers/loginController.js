//Importamos los modelos
import customersModel from "../models/Customers.js";
import employeesModel from "../models/employee.js";
import bcryptjs from "bcryptjs"; // Encriptar
import jsonwebtoken from "jsonwebtoken"; // generar token
import { config } from "../config.js";

// Array de funciones
const loginController = {};

loginController.login = async (req, res) => {
  //Pedimos las cosas
  const { email, password } = req.body;

  try {
    //Validamos los 3 posibles niveles
    // 1. Admin, 2. Empleado, 3. Cliente

    let userFound; //Guarda el usuario encontrado
    let userType; //Guarda el tipo de usuario encontrado

    //1. Admin
    if (
      email === config.ADMIN.emailAdmin &&
      password === config.ADMIN.password
    ) {
      userType = "admin";
      userFound = { _id: "admin" };
    } else {
      //2. Empleados
      userFound = await employeesModel.findOne({ email });
      userType = "employee";
      if (!userFound) {
        //3. Cliente
        userFound = await customersModel.findOne({ email });
        userType = "customer";
      }
    }

    //Si no encontramos a ningun usuario con esas credenciales
    if (!userFound) {
      return res.json({ message: "User not found" });
    }

    // Validar la contraseña
    // SOLO SI NO ES ADMIN
    if (userType !== "admin") {
      const isMatch = await bcryptjs.compare(password, userFound.password);
      if (!isMatch) {
        return res.json({ message: "Invalid password" });
      }
    }

    //// TOKEN
    //Para validar que inició sesión
    jsonwebtoken.sign(
      //1-Que voy a guardar
      { id: userFound._id, userType },
      //2-Secreto
      config.JWT.secret,
      //3-Cuando expira
      { expiresIn: config.JWT.expiresIn },
      //4. Funcion flecha
      (error, token) => {
        if (error) console.log("error" + error);
        res.cookie("authToken", token);
        res.json({ message: "Login successful" });
      }
    );
  } catch (error) {
    console.log("error" + error);
  }
};

export default loginController;
