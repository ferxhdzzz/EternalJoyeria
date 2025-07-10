// backend/src/models/Category.js

import mongoose from "mongoose";

const { Schema, model } = mongoose;

/*
  Esquema de Categorías
  ---------------------
  Campos:
    - name: Nombre de la categoría (obligatorio, único, sin espacios extra, mínimo 2 caracteres)
    - description: Descripción de la categoría (obligatoria, mínimo 5 caracteres)
    - image: URL de la imagen de la categoría (obligatoria)
*/

const categorySchema = new Schema(
  {
    name: {
      type: String,
      required: true, // El nombre es obligatorio
      trim: true,     // Elimina espacios al inicio y final
      unique: true,   // No se permiten nombres duplicados
      minlength: 2,   // Longitud mínima de 2 caracteres
    },
    description: {
      type: String,
      required: true, // La descripción es obligatoria
      trim: true,     // Elimina espacios al inicio y final
      minlength: 5,   // Longitud mínima de 5 caracteres
    },
    image: {
      type: String,
      required: true, // La imagen es obligatoria
      default: "",    // Valor por defecto: string vacío
    },
  },
  {
    strict: true, // Solo se guardarán campos definidos en el esquema
  }
);

export default model("categorys", categorySchema, "categorys");
