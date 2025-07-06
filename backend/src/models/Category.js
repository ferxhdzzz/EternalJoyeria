// backend/src/models/Category.js
import mongoose from "mongoose";

const { Schema, model } = mongoose;

const categorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true // Prevent duplicate category names
    },

    description: {
      type: String,
      require: true,
    },

    image: {
      type: String,
      default: ""
    }
  },
  {
    strict: false,
  }
);

export default model("categorys", categorySchema, "categorys");
