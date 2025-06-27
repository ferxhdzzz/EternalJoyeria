import { Schema, model } from "mongoose";

const customersSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true, 
    },
    email: {
      type: String,
      required: true, 
      unique: true,   // Agregado: para evitar duplicados
      lowercase: true,//lowercase: trueEsto hace que el valor del campo (en este caso, el correo) se convierta automáticamente a minúsculas antes de guardarlo en la base de datos.
      trim: true,//Esto elimina los espacios en blanco al inicio y al final del texto antes de guardarlo. 
    },
    password: {
      type: String,
      required: true, 
    },
    phone: {
      type: String,
      required: true, 
    },
    isVerified: { 
      type: Boolean,
      default: false 
    },
    profilePicture: { 
      type: String,
      default: "" // Cambiado a string vacío para consistencia con el controlador
    },
  },
  {
    timestamps: true,
    strict: false,
  }
);

export default model("customers", customersSchema);