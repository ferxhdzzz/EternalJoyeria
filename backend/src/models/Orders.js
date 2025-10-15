import { Schema, model } from "mongoose";

const addressSchema = new Schema(
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

// 📦 Snapshot de producto (cuando se realiza la compra)
const productSnapshotSchema = new Schema(
  {
    name: String,
    images: [String],
    price: Number,
    finalPrice: Number,
    discountPercentage: Number,
  },
  { _id: false }
);

const ordersSchema = new Schema(
  {
    idCustomer: {
      type: Schema.Types.ObjectId,
      ref: "Customers",
      required: true,
    },

    products: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "Products",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
          validate: {
            validator: Number.isInteger,
            message: "La cantidad debe ser un número entero",
          },
        },
        subtotal: { type: Number, min: 0 },
        unitPriceCents: { type: Number, min: 0 },
        subtotalCents: { type: Number, min: 0 },
        variant: { type: Object },

        // 💾 Nuevo: snapshot del producto en el momento de la compra
        productSnapshot: { type: productSnapshotSchema, default: undefined },
      },
    ],

    total: { type: Number, required: true, min: 0 },
    totalCents: { type: Number, default: 0, min: 0 },
    shippingCents: { type: Number, default: 0, min: 0 },
    taxCents: { type: Number, default: 0, min: 0 },
    discountCents: { type: Number, default: 0, min: 0 },
    currency: { type: String, default: "USD" },

    shippingAddress: { type: addressSchema, default: undefined },

    status: {
      type: String,
      enum: ["cart", "pending_payment", "pagado", "no pagado", "completed"],
      default: "cart",
    },
  },
  {
    timestamps: true,
  }
);

// 🔒 Solo un carrito activo por usuario
ordersSchema.index(
  { idCustomer: 1, status: 1 },
  { unique: true, partialFilterExpression: { status: "cart" } }
);

export default model("Orders", ordersSchema);
