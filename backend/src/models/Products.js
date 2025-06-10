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
      require: true,
    },

    description: {
      type: String,
      require: true,
    },

    price: {
      type: Number,
      require: true,
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
      ref: "categories",
      require: true,
    },

    discountPercentage: {
      type: Number,
      default: null,
      min: 0,
      max: 100,
    },

    finalPrice: {
      type: Number,
      require: true,
    },
  },
  {
    timestamps: true,
    strict: false,
  }
);

export default model("products", productSchema);
