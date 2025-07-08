// ===== IMPORTACIONES =====
import customersModel from "../models/Customers.js";
import adminModel from "../models/Administrator.js";
import bcryptjs from "bcryptjs";
import jsonwebtoken from "jsonwebtoken";
import { config } from "../config.js";

// ===== OBJETO CONTROLADOR =====
const loginController = {};

// ===== FUNCIÓN PRINCIPAL DE LOGIN =====
loginController.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Email and password are required"
    });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      message: "Invalid email format"
    });
  }

  try {
    let userFound;
    let userType;

    const adminFound = await adminModel.findOne({ email: email.toLowerCase() });

    if (adminFound) {
      userType = "admin";
      userFound = adminFound;

      const isMatch = await bcryptjs.compare(password, adminFound.password);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: "Invalid credentials"
        });
      }

    } else {
      userFound = await customersModel.findOne({ email: email.toLowerCase() });

      if (userFound) {
        userType = "customer";

        const isMatch = await bcryptjs.compare(password, userFound.password);
        if (!isMatch) {
          return res.status(401).json({
            success: false,
            message: "Invalid credentials"
          });
        }
      }
    }

    if (!userFound) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    const token = jsonwebtoken.sign(
      {
        id: userFound._id,
        userType,
        email: userFound.email
      },
      config.JWT.JWT_SECRET,
      { expiresIn: config.JWT.expiresIn }
    );

    // ✅ Guardar información del usuario en la sesión
    req.session.user = {
      _id: userFound._id,
      name: userFound.name,
      email: userFound.email,
      userType
    };

    res.cookie("authToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 24 * 60 * 60 * 1000
    });

    res.status(200).json({
      success: true,
      message: "Login successful",
      userType,
      user: {
        id: userFound._id,
        email: userFound.email,
        name: userFound.name
      }
    });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

// ===== FUNCIÓN DE LOGOUT =====
loginController.logout = (req, res) => {
  res.clearCookie("authToken", {
    path: '/',
    sameSite: 'strict'
  });
  req.session.destroy(() => {
    res.status(200).json({
      success: true,
      message: "Logout successful"
    });
  });
};

export default loginController;
