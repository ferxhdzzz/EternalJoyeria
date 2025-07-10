// backend/src/models/Product.js
import { Schema, model } from "mongoose";

// Defino el esquema del producto con validaciones y estructura limpia
const productSchema = new Schema(
  {
    name: {
      type: String,
      required: true, // Obligatorio: no puede ser nulo
      trim: true,     // Elimina espacios al inicio y final
      minlength: 2,   // Mínimo 2 caracteres
    },

    description: {
      type: String,
      required: true, // Obligatorio
      trim: true,     
      minlength: 5,   // Mínimo 5 caracteres
    },

    price: {
      type: Number,
      required: true, // Obligatorio
      min: 0,         // No puede ser negativo
    },

    images: {
      type: [String],
      default: [],    // Por defecto, un arreglo vacío
      validate: {
        validator: function (v) {
          return Array.isArray(v);
        },
        message: "Las imágenes deben ser un arreglo de URLs",
      },
    },

    measurements: {
      type: Object,
      default: {}, // Objeto vacío si no se envía
    },

    category_id: {
      type: Schema.Types.ObjectId,
      ref: "categorys",
      required: true, // Obligatorio
    },

    discountPercentage: {
      type: Number,
      default: null,
      min: 0,   // No puede ser negativo
      max: 100, // Máximo 100%
    },

    finalPrice: {
      type: Number,
      required: true, 
      min: 0,  // No puede ser negativo
    },
  },
  {
    strict: true,    
    timestamps: true, // Guarda fecha de creación/actualización
  }
);

// Exporto el modelo
export default model("Products", productSchema, "products");
