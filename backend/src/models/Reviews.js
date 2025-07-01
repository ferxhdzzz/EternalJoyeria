// backend/src/models/Review.js
import { Schema, model } from "mongoose";

/*
  Campos:
    id_customer = Referencia al cliente que hace la review
    rank = Puntuación del producto (por ejemplo, de 1 a 5)
    comment = Comentario del cliente
*/

const reviewSchema = new Schema(
  {
    id_customer: {
      type: Schema.Types.ObjectId,
      ref: "customers", // Asegúrate de que este sea el nombre correcto de tu colección de clientes
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
