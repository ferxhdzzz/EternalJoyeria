// backend/src/models/Review.js
import { Schema, model } from "mongoose";

/*
  Campos:
    id_customer: Referencia al cliente
    id_product: Referencia al producto
    rank: Puntuación del producto (1 a 5)
    comment: Comentario del cliente
*/

const reviewSchema = new Schema(
  {
    id_customer: {
      type: Schema.Types.ObjectId,
      ref: "customers",
      required: true,
    },
    id_product: {
      type: Schema.Types.ObjectId,
      ref: "Products",
      required: true,
    },
    rank: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    strict: false,
  }
);

export default model("Reviews", reviewSchema, "reviews");
