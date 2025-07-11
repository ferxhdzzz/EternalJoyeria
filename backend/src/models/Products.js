// backend/src/models/Product.js
import { Schema, model } from "mongoose";

/*
    Campos:
      name
      description
      price
      images
      measurements
      category_id
      discountPercentage (opcional)
      finalPrice (siempre se calcula)
*/

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    images: {
      type: [String],
      default: [],
    },

    measurements: {
      type: Object,
    },

    category_id: {
      type: Schema.Types.ObjectId,
      ref: "categorys",
      required: true,
    },

    discountPercentage: {
      type: Number,
      default: null,
      min: 0,
      max: 100,
    },

    finalPrice: {
      type: Number,
      required: true,
    },

    stock: {
      type: Number,
      default: 1,
      min: 1,
      max: 20,
    },
  },
  {
    strict: false,
  }
);

export default model("Products", productSchema, "products");