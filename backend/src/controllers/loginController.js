//Importamos los modelos
import customersModel from "../models/Customers.js";
import bcryptjs from "bcryptjs"; // Encriptar
import jsonwebtoken from "jsonwebtoken"; // generar token
import { config } from "../config.js";

// Array de funciones
const loginController = {};

loginController.login = async (req, res) => {
  //Pedimos las cosas
  const { email, password } = req.body;

  try {
    //Validamos los 2 posibles niveles
    // 1. Admin, 2. Cliente

    let userFound; //Guarda el usuario encontrado
    let userType; //Guarda el tipo de usuario encontrado

    //1. Admin
    if (
      email === config.adminAccount.email &&
      password === config.adminAccount.password
    ) {
      userType = "admin";
      userFound = { _id: "admin" };
    } else {
      //2. Cliente
      userFound = await customersModel.findOne({ email });
      userType = "customer";
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
    const token=jsonwebtoken.sign(
      //1-Que voy a guardar
      { id: userFound._id, userType },
      //2-Secreto
      config.JWT.JWT_SECRET,
      //3-Cuando expira
      { expiresIn: config.JWT.expiresIn },
      //4. Funcion flecha
    

    )

    res.cookie("authToken", token,
      { path:'/', //cookie disponibloe en toda la aplicacion 
     sameSite:'lax',  // proteccion contra CSRF});
 }
);
    res.json({ message: "Login successful" });
  } catch (error) {
    console.log("error" + error);
  }
};

export default loginController;