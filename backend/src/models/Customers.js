import { Schema, model } from "mongoose";

const customersSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      minlength: 3
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
      minlength: 8
    },
    isVerified: { 
      type: Boolean,
       required: true,
      default: false 
    },
    profilePicture: { 
      type: String,
      default: "" // Cambiado a string vacío para consistencia con el controlador
    },
    loginAttempts:{
      type:Number,
      default: null,
    },
    timeOut:{
      type: Date,
      default: null,
    }
  },
  {
    strict: false,
  }
);

export default model("Customers", customersSchema);