/*
    Campos:
        nombre
        descripcion
        precio
        stock
*/

import { Schema, model } from "mongoose";

const customersSchema = new Schema(
  {
    firstName: {
      type: String,
      require: true,
    },
    lastName: {
      type: String,
      require: true,
    },

    email: {
      type: String,
    },

    password: {
      type: String,
      require: true,
    },

    phone: {
      type: String,
      require: true,
    },

    
  },
  {
    timestamps: true,
    strict: false,
  }
);

export default model("users", customersSchema);
