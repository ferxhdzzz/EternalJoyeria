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