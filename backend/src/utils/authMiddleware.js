// backend/src/utils/authMiddleware.js
import jwt from "jsonwebtoken";
import Customer from "../models/Customers.js";
import { config } from "../config.js";

/**
 * protect: Middleware to protect routes.
 * 1) Reads token from cookie "tokenEternalJoyeria"
 * 2) Verifies JWT
 * 3) If decoded.userId === "admin", treat as env-based admin (no DB lookup).
 * 4) Otherwise, find the user in MongoDB by _id.
 * 5) Attach req.user = { id, role } and call next().
 */
export const protect = async (req, res, next) => {
  try {
    // 1) Read token from cookie
    const token = req.cookies.tokenEternalJoyeria;
    if (!token) {
      return res.status(401).json({ message: "Access denied. No token provided." });
    }

    // 2) Verify token
    const decoded = jwt.verify(token, config.jwt.secret);

    // 3) If this is our “env-based admin” (userId === "admin"), skip DB lookup
    if (decoded.userId === "admin") {
      // Attach a “mock” admin user and proceed
      req.user = {
        id: "admin",
        role: "admin"
      };
      return next();
    }

    // 4) Otherwise, treat decoded.userId as a real MongoDB ObjectId
    const user = await Customer.findById(decoded.userId).select("-password");
    if (!user) {
      return res.status(401).json({ message: "Unauthorized. User not found." });
    }

    // 5) Attach real user info to req.user and proceed
    req.user = {
      id: user._id.toString(),
      role: user.role
    };
    next();
  } catch (err) {
    console.error("authMiddleware protect error:", err);
    return res.status(401).json({ message: "Invalid or expired token." });
  }
};

/**
 * authorizeAdmin: Middleware to allow only users whose role is 'admin'.
 * If req.user.role !== 'admin', respond with 403 Forbidden.
 */
export const authorizeAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ message: "Forbidden. Admins only." });
  }
  next();
};
