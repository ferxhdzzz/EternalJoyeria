import { Schema, model } from "mongoose";

const administratorSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
       minlength: 3,
      unique: true,  // Para evitar correos duplicados
      trim: true, // Esto elimina los espacios en blanco al inicio y al final del texto antes de guardarlo.
    },
    email: {
      type: String,
      required: true,
      unique: true,  // Para evitar correos duplicados
      lowercase: true, // Esto hace que el valor del campo se convierta automáticamente a minúsculas antes de guardarlo en la base de datos.
      trim: true, // Esto elimina los espacios en blanco al inicio y al final del texto antes de guardarlo.
    },
    password: {
      type: String,
      required: true,
    },
    profilePicture: {
      type: String,
      default: "", // URL o path de la imagen
    },
  },
  {
    timestamps: true,
    strict: false,
  }
);

export default model("Administrator", administratorSchema);