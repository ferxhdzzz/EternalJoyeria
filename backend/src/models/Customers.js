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
      required: true, // Agregado: el email debería ser requerido
      unique: true,   // Agregado: para evitar duplicados
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
      default: "" // Cambiado a string vacío para consistencia con tu controlador
    },
  },
  {
    strict: false,
  }
);

export default model("customers", customersSchema);