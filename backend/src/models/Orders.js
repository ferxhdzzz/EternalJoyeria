import { Schema, model } from "mongoose";

/* =======================================
 * 1. ESQUEMA DE DIRECCIÓN (addressSchema)
 * Se añaden `trim: true` y `required: true` a los campos clave 
 * para asegurar que Mongoose los guarde y valide.
 * ======================================= */
const addressSchema = new Schema(
  {
    // Información de contacto y destinatario
    recipientName: { type: String, trim: true, required: true }, // Nombre del destinatario (obligatorio)
    name: { type: String, trim: true }, // Nombre (opcional)
    phone: { type: String, trim: true, required: true }, // Teléfono (obligatorio)
    email: { type: String, trim: true }, // Email (opcional, pero útil)

    // Líneas de dirección
    line1: { type: String, trim: true, required: true }, // Calle y número principal (obligatorio)
    line2: { type: String, trim: true }, // Apartamento, suite, etc. (opcional)

    // Ubicación geográfica
    city: { type: String, trim: true, required: true }, // Ciudad (obligatorio)
    region: { type: String, trim: true }, // Región/Departamento/Estado (opcional)
    country: { type: String, trim: true, required: true, default: "Desconocido" }, // País (obligatorio)
    zip: { type: String, trim: true, required: true }, // Código Postal (obligatorio)
  },
  { _id: false }
);

/* =======================================
 * 2. ESQUEMA DE ÓRDENES (ordersSchema)
 * ======================================= */
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
        subtotal: { type: Number, min: 0 },        // USD (legacy)
        unitPriceCents: { type: Number, min: 0 },  // Precio unitario en centavos (importante para recalcular)
        subtotalCents: { type: Number, min: 0 },   // Subtotal de la línea en centavos
        variant: { type: Object },                 // talla, color, etc (opcional)
      },
    ],

    // Totales de la orden
    total: { type: Number, required: true, min: 0 }, // USD
    totalCents: { type: Number, default: 0, min: 0 },
    shippingCents: { type: Number, default: 0, min: 0 },
    taxCents: { type: Number, default: 0, min: 0 },
    discountCents: { type: Number, default: 0, min: 0 },
    currency: { type: String, default: "USD" },

    // Dirección de envío (snapshot de la dirección de envío en el momento de la compra)
    shippingAddress: { type: addressSchema, default: undefined },

    // Estados del ciclo de vida
    status: {
      type: String,
      enum: ["cart", "pendiente", "pagado", "no pagado", "pending_payment"], 
      default: "cart",
    },
    
    wompiReference: { type: String, trim: true }, // Referencia de pago externa (si aplica)
  },
  {
    timestamps: true,
  }
);

// Índice de unicidad para garantizar que un usuario solo tenga un carrito a la vez.
ordersSchema.index(
  { idCustomer: 1, status: 1 },
  { unique: true, partialFilterExpression: { status: "cart" } }
);

export default model("Orders", ordersSchema);