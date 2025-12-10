// backend/src/models/Product.js
import { Schema, model } from "mongoose";

const productSchema = new Schema(
  {
    name: { type: String, required: true, minlength: 3 },
    description: { type: String, required: true, minlength: 5 },

    price: { type: Number, required: true },
    images: { type: [String], default: [], required: true },

    measurements: { type: Object, required: true },

    category_id: {
      type: Schema.Types.ObjectId,
      ref: "categorys",
      required: true,
    },

    // ← ← ← NUEVO
    country: {
      type: String,
      enum: ["SV", "US"],
      required: true,
    },

    discountPercentage: { type: Number, default: null, min: 0, max: 90 },
    finalPrice: { type: Number, required: true },

    stock: { type: Number, required: true, default: 1, min: 1, max: 100 },
    status: { type: String, default: "disponible" }
  },
  { strict: false }
);

export default model("Products", productSchema, "products");
