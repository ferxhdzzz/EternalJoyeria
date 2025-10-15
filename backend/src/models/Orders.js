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
        // soporta ambos mundos (tu código viejo y el nuevo en centavos)
        subtotal: { type: Number, min: 0 },        // USD (legacy)
        unitPriceCents: { type: Number, min: 0 },  // opcional
        subtotalCents: { type: Number, min: 0 },   // opcional
        variant: { type: Object },                 // talla, etc (opcional)
      },
    ],

    // totales
    total: { type: Number, required: true, min: 0 }, // USD (legacy)
    totalCents: { type: Number, default: 0, min: 0 },
    shippingCents: { type: Number, default: 0, min: 0 },
    taxCents: { type: Number, default: 0, min: 0 },
    discountCents: { type: Number, default: 0, min: 0 },
    currency: { type: String, default: "USD" },

    // dirección de envío (snapshot para la venta)
    shippingAddress: { type: addressSchema, default: undefined },

    // estados 
    status: {
      type: String,
      enum: ["cart", "pending_payment", "pagado", "no pagado"],
      default: "cart",
    },
  },
  {
    timestamps: true,
  }
);

// Un (1) carrito por usuario: único sólo cuando status === "cart"
ordersSchema.index(
  { idCustomer: 1, status: 1 },
  { unique: true, partialFilterExpression: { status: "cart" } }
);


export default model("Orders", ordersSchema);
