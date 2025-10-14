// backend/src/models/Products.js
import { Schema, model } from "mongoose";

const productSchema = new Schema(
  {
    name: { type: String, required: true, minlength: 3 },
    description: { type: String, required: true, minlength: 5 },
    price: { type: Number, required: true, min: 1 },
    images: { type: [String], default: [], required: true },
    measurements: { type: Object, required: true },
    category_id: { type: Schema.Types.ObjectId, ref: "categorys", required: true },
    discountPercentage: { type: Number, default: null, min: 0, max: 90 },
    finalPrice: { type: Number, required: true },
    stock: { type: Number, required: true, default: 1, min: 0 }, // min: 0 para permitir stock agotado
    condition: { type: String, default: "OK" },
    isDefectiveOrDeteriorated: { type: Boolean, default: false },
    defectType: { type: String, enum: [null, "defective", "deteriorated"], default: null },
    defectNote: { type: String, default: "" },
    defectMarkedAt: { type: Date, default: null },
  },
  {
    strict: false,
    timestamps: true,
  }
);

productSchema.index({ isDefectiveOrDeteriorated: 1 });

export default model("Products", productSchema, "products");