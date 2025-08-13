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
        minlength: 3,
      
    },

    description: {
      type: String,
      required: true,
        minlength: 5,
    },

    price: {
      type: Number,
      required: true,
        minlength: 1,
    },

    images: {
      type: [String],
      default: [],
      required: true,
    },

    measurements: {
      type: Object,
      required: true
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
      max: 90,
    },

    finalPrice: {
      type: Number,
      required: true,
    },

    stock: {
      type: Number,
      required: true,
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