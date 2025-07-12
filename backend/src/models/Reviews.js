import { Schema, model } from "mongoose";

/*
  Esquema de Reseñas (Reviews)
  - id_customer: Referencia al cliente (obligatorio)
  - id_product: Referencia al producto (obligatorio)
  - rank: Puntuación del producto (1 a 5, obligatorio)
  - comment: Comentario del cliente (obligatorio)
*/

const reviewSchema = new Schema(
  {
    id_customer: {
      type: Schema.Types.ObjectId,
      ref: "Customers",
      required: true, // Debe existir un cliente
    },
    id_product: {
      type: Schema.Types.ObjectId,
      ref: "Products",
      required: true, // Debe existir un producto
    },
    rank: {
      type: Number,
      required: true, // Puntuación obligatoria
      min: 1,          // Mínimo 1 estrella
      max: 5,          // Máximo 5 estrellas
    },
    comment: {
      type: String,
      required: true, // Comentario obligatorio
      trim: true,     // Quita espacios innecesarios
    },
  },
  {
    timestamps: true, // Guarda fecha de creación/actualización
    strict: false,
  }
);

export default model("Reviews", reviewSchema, "reviews");