// backend/src/utils/cloudinary.js
import { v2 as cloudinary } from "cloudinary";
import { config } from "../config.js";

/**
 * Configure Cloudinary using credentials from config.cloudinary.
 * We’ll use this in our multer-storage-cloudinary setup to upload images.
 */
cloudinary.config({
  cloud_name: config.cloudinary.cloud_name,
  api_key: config.cloudinary.api_key,
  api_secret: config.cloudinary.api_secret,
  secure: config.cloudinary.secure
});

export default cloudinary;
