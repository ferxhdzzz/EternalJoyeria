// backend/src/controllers/registerClientController.js
import Customer from "../models/Customers.js";
import jwt from "jsonwebtoken";
import { config } from "../config.js";

/**
 * registerClient: Handles client registration (signup).
 * Route: POST /api/registerClient
 * Access: Public
 */
export const registerCustomers = async (req, res) => {
  try {
    const { firstName, lastName, email, password, phone } = req.body;

    // Basic validation
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    // Email format check (simple regex)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format." });
    }

    // Password length check
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters." });
    }

    // Check if email is already in use
    const existing = await Customer.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return res.status(400).json({ message: "Email already registered." });
    }

    // Create new user (password will be hashed by the pre-save hook)
    const newUser = new Customer({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.toLowerCase().trim(),
      password,
      phone: phone ? phone.trim() : ""
    });

    const savedUser = await newUser.save();

    return res.status(201).json({
      message: "Registration successful.",
      user: {
        id: savedUser._id,
        firstName: savedUser.firstName,
        lastName: savedUser.lastName,
        email: savedUser.email,
        role: savedUser.role
      }
    });
  } catch (err) {
    console.error("Error in registerCustomers:", err);
    if (err.code === 11000) {
      // Duplicate email error
      return res.status(400).json({ message: "Email already registered." });
    }
    return res.status(500).json({ message: "Server error during registration." });
  }
};
