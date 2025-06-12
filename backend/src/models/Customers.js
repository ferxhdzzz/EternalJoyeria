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
    name: {
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

    telephone: {
      type: String,
      require: true,
    },

    dui: {
      type: String,
      require: true,
    },
    addres: {
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
