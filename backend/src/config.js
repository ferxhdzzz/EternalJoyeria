// backend/src/config.js
import dotenv from "dotenv";
dotenv.config();

export const config = {
  db: {
    URI: process.env.DB_URI || "mongodb://localhost:27017/EternalJoyeria",
  },

  server: {
    port: process.env.PORT || 4000,
  },

  JWT: {
    JWT_SECRET: process.env.JWT_SECRET || "defaultSecret123",
    expiresIn: process.env.JWT_EXPIRE_IN || "2h" 
  },

  adminAccount: {
    email: process.env.ADMIN_EMAIL,
    password: process.env.ADMIN_PASSWORD,
  },

  smtp: {
    user: process.env.USER_EMAIL,
    pass: process.env.USER_PASS,
  },

  cloudinary: {
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
  }
};