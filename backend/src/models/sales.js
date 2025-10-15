// backend/src/models/sales.js
import mongoose from "mongoose";
const { Schema } = mongoose;

// 📦 Snapshot del producto (para mantener la información aunque se elimine)
const productSnapshotSchema = new Schema(
  {
    name: String,
    images: [String],
    price: Number,
    finalPrice: Number,
    discountPercentage: Number,
    quantity: Number,
    subtotal: Number,
  },
  { _id: false }
);

// 🏠 Snapshot de dirección (dirección al momento de la compra)
const addressSnapshotSchema = new Schema(
  {
    name: String,
    phone: String,
    email: String,
    line1: String,
    city: String,
    region: String,
    country: String,
    zip: String,
  },
  { _id: false }
);

// 🧾 Esquema de ventas
const salesSchema = new Schema(
  {
    // 🔗 Referencia a la orden original
    idOrder: {
      type: Schema.Types.ObjectId,
      ref: "Orders",
      required: true,
    },

    // 👤 Cliente que realizó la compra
    idCustomers: {
      type: Schema.Types.ObjectId,
      ref: "Customers",
      required: true,
    },

    // 💳 ID de pago (de MercadoPago o MOCK)
    payment_id: {
      type: String,
      required: false,
    },

    // 📅 Fecha de la compra
    date: {
      type: Date,
      default: Date.now,
    },

    // 💰 Total de la venta
    total: {
      type: Number,
      required: true,
      min: 0,
    },

    // 📍 Dirección de envío snapshot
    addressSnapshot: {
      type: addressSnapshotSchema,
      default: undefined,
    },

    // 🛍️ Lista de productos comprados (snapshot)
    productsSnapshot: {
      type: [productSnapshotSchema],
      default: [],
    },

    // 🔖 Estado de la venta
    status: {
      type: String,
      enum: ["completed", "cancelled", "refunded"],
      default: "completed",
    },
  },
  {
    strict: false,
    timestamps: true,
  }
);

// Evita error OverwriteModelError si el archivo se carga más de una vez
export default mongoose.models["sales"] ||
  mongoose.model("sales", salesSchema, "sales");
