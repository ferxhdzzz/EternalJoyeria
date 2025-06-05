// backend/src/models/Customers.js
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const { Schema, model } = mongoose;

const customerSchema = new Schema(
  {
    firstName: {
      type: String,
      required: [true, "First name is required."],
      trim: true
    },
    lastName: {
      type: String,
      required: [true, "Last name is required."],
      trim: true
    },
    email: {
      type: String,
      required: [true, "Email is required."],
      unique: true, // No two accounts with the same email
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: [true, "Password is required."],
      minlength: [6, "Password must be at least 6 characters."]
    },
    phone: {
      type: String,
      default: ""
    },
    role: {
      type: String,
      enum: ["cliente", "admin"],
      default: "cliente"
    }
  },
  {
    timestamps: true // Adds createdAt/updatedAt
  }
);

// ── Hash password before saving to the database ──────────────────────
customerSchema.pre("save", async function (next) {
  try {
    // Only hash if the password field was modified (or is new)
    if (!this.isModified("password")) {
      return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    return next();
  } catch (err) {
    return next(err);
  }
});

// ── Compare a plaintext password with the hashed one in the DB ────────
customerSchema.methods.comparePassword = async function (plainPassword) {
  return await bcrypt.compare(plainPassword, this.password);
};

export default model("Customer", customerSchema, "users");
