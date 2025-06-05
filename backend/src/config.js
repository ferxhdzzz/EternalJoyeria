// backend/src/config.js
import dotenv from "dotenv";
dotenv.config();

export const config = {
  // MongoDB connection string
  db: {
    URI: process.env.DB_URI || "mongodb://localhost:27017/EternalJoyeria",
  },

  // Server port
  server: {
    port: process.env.PORT || 4000,
  },

  // JWT settings
  jwt: {
    secret: process.env.JWT_SECRET || "defaultSecret123",
    expiresIn: process.env.JWT_EXPIRE_IN || "2h" // Note: using JWT_EXPIRES from .env
  },

  // Initial admin credentials (if you need to bootstrap an admin user)
  adminAccount: {
    email: process.env.ADMIN_EMAIL || "",
    password: process.env.ADMIN_PASSWORD || ""
  },

  // SMTP settings (for password recovery emails)
  smtp: {
    user: process.env.USER_EMAIL || "",
    pass: process.env.USER_PASS || ""
  },

  // Cloudinary credentials
  cloudinary: {
    cloud_name: process.env.CLOUDINARY_NAME || "",
    api_key: process.env.CLOUDINARY_API_KEY || "",
    api_secret: process.env.CLOUDINARY_API_SECRET || "",
    secure: true
  }
};
