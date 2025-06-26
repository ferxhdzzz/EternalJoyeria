import jsonwebtoken from "jsonwebtoken"; //Token
import bcryptjs from "bcryptjs"; //Encriptar

import clientsModel from "../models/Customers.js";

import { sendEmail, HTMLRecoveryEmail } from "../utils/mailRecoveryPassword.js";
import { config } from "../config.js";

//1- Crear un array de funciones
const passwordRecoveryController = {};

// Función para solicitar el código de recuperación
passwordRecoveryController.requestCode = async (req, res) => {
  const { email } = req.body;

  try {
    // Buscar al usuario por email en la base de datos de clientes
    let userFound = await clientsModel.findOne({ email });

    // Si no se encuentra el usuario, devolver mensaje de error
    if (!userFound) {
      res.json({ message: "User not found" });
    }

    // Generar un código aleatorio de 5 dígitos
    // (El que se va a enviar por correo)
    const code = Math.floor(10000 + Math.random() * 90000).toString();

    // Guardamos toda la información en un token JWT
    const token = jsonwebtoken.sign(
      //1-¿Que voy a guardar? - email, código, tipo de usuario y estado de verificación
      { email, code, userType: "client", verified: false },
      //2-secret key - clave secreta para firmar el token
      config.JWT.JWT_SECRET,
      //3-¿Cuando expira? - el token expira en 20 minutos
      { expiresIn: "20m" }
    );

    // Guardar el token en una cookie con duración de 20 minutos
    res.cookie("tokenRecoveryCode", token, { maxAge: 20 * 60 * 1000, 
      path:'/', //cookie disponibloe en toda la aplicacion 
     sameSite:'lax',  // proteccion contra CSRF});
     }

      
    );

    // ULTIMO PASO => enviar el correo electrónico con el código de verificación
    await sendEmail(
      email,
      "You verification code", //Asunto del correo
      "Hello! Remember dont forget your pass", //Cuerpo del mensaje en texto plano
      HTMLRecoveryEmail(code) //HTML del correo con el código
    );

    res.json({ message: "correo enviado" });
  } catch (error) {
    console.log("error" + error);
  }
};

// FUNCIÓN PARA VERIFICAR EL CÓDIGO enviado por correo
passwordRecoveryController.verifyCode = async (req, res) => {
  const { code } = req.body;

  try {
    // Extraer el token de las cookies del navegador
    const token = req.cookies.tokenRecoveryCode;

    // Decodificar y verificar la información del token JWT
    const decoded = jsonwebtoken.verify(token, config.JWT.JWT_SECRET);

    // Comparar el código enviado con el código almacenado en el token
    if (decoded.code !== code) {
      return res.json({ message: "Invalid code" });
    }

    // Marcar el token como verificado creando un nuevo token
    const newToken = jsonwebtoken.sign(
      //1-¿Que vamos a guardar? - misma info pero ahora marcada como verificada
      {
        email: decoded.email,
        code: decoded.code,
        userType: decoded.userType,
        verified: true, // Ahora el código está verificado
      },
      //2- Secret key para firmar el nuevo token
      config.JWT.JWT_SECRET,
      //3- ¿Cuando expira? - 20 minutos más
      { expiresIn: "20m" }
    );

    // Actualizar la cookie con el nuevo token verificado
    res.cookie("tokenRecoveryCode", newToken, { maxAge: 20 * 60 * 1000 });

    res.json({ message: "Code verified successfully" });
  } catch (error) {
    console.log("error" + error);
  }
};

// FUNCIÓN PARA ASIGNAR LA NUEVA CONTRASEÑA
passwordRecoveryController.newPassword = async (req, res) => {
  const { newPassword } = req.body;

  try {
    // Extraer el token de recuperación de las cookies
    const token = req.cookies.tokenRecoveryCode;

    // Decodificar la información del token
    const decoded = jsonwebtoken.verify(token, config.JWT.JWT_SECRET);

    // Verificar que el código haya sido verificado previamente
    if (!decoded.verified) {
      return res.status(400).json({ message: "Code not verified" });
    }

    // Extraer el email del token decodificado
    const { email } = decoded;

    // Encriptar la nueva contraseña usando bcrypt con salt de 10 rounds
    const hashedPassword = await bcryptjs.hash(newPassword, 10);


const oldPassword = await clientsModel.find({email})
//1-Primero comparar la nueva contra con la contra actual
//si la contra es igual retornar un error

//const validacion = await bcryptjs.compare(newPassword, oldPassword.password)

//if(validacion){
  //  return res.status(400).json({message: "contraseñas iguales"})
//}




    // Actualizar la contraseña del usuario en la base de datos

    // findOneAndUpdate busca por email y actualiza la contraseña
    // new: true devuelve el documento actualizado
    let updatedUser = await clientsModel.findOneAndUpdate(
      { email },
      { password: hashedPassword },
      { new: true }
    );

    // Eliminar el token de las cookies por seguridad
    res.clearCookie("tokenRecoveryCode");

    res.json({ message: "Password updated" });
  } catch (error) {
    console.log("error here" + error);
  }
};

export default passwordRecoveryController;