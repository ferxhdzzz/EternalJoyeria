// backend/src/controllers/loginController.js
import Customer from "../models/Customers.js";
import jwt from "jsonwebtoken";
import { config } from "../config.js";

/**
 * loginClient: Handles user login or admin (env-based).
 * Route: POST /api/login/login
 * Access: Public
 */
export const loginClient = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1) If the credentials match the ADMIN_EMAIL & ADMIN_PASSWORD in .env, issue a token immediately:
    if (
      email === config.adminAccount.email &&      // config.adminAccount.email === process.env.ADMIN_EMAIL
      password === config.adminAccount.password    // config.adminAccount.password === process.env.ADMIN_PASSWORD
    ) {
      // Create a payload for an "admin" user. We can set userId to something like "admin" or a fixed string
      // or even leave it null, as long as your downstream code that checks the token can handle it.
      const payload = {
        userId: "admin",       // you can use any unique string since there's no actual DB _id
        role: "admin"
      };

      // Sign the JWT with the configured secret and expiration
      const token = jwt.sign(payload, config.jwt.secret, {
        expiresIn: config.jwt.expiresIn
      });

      // Set the cookie with the token
      res.cookie("tokenEternalJoyeria", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
        maxAge: 30 * 24 * 60 * 60 * 1000  // 30 days, since JWT_EXPIRES_IN=30d
      });

      return res.status(200).json({
        message: "Login successful (env‐based admin).",
        user: {
          id: "admin",
          firstName: "Admin",
          lastName: "Account",
          email: config.adminAccount.email,
          role: "admin"
        }
      });
    }

    // 2) Otherwise, proceed with the normal database lookup (cliente or any other user)
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required." });
    }

    // Find the user in MongoDB
    const user = await Customer.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    // Compare plaintext password with the hashed password stored in user.password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    // Create a normal JWT for this “customer”
    const payload = { userId: user._id, role: user.role };
    const token = jwt.sign(payload, config.jwt.secret, {
      expiresIn: config.jwt.expiresIn
    });

    // Set the cookie for regular user
    res.cookie("tokenEternalJoyeria", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 30 * 24 * 60 * 60 * 1000
    });

    return res.status(200).json({
      message: "Login successful (DB user).",
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.error("❌ Error in loginClient:", err);
    return res.status(500).json({ message: "Server error during login." });
  }
};
