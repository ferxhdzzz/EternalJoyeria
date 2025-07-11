import { Schema, model } from "mongoose";

/*
  Esquema de Órdenes
  - idCustomer: Referencia al cliente (obligatorio)
  - products: Array de productos con cantidad y subtotal validados
  - total: Monto total de la orden (requerido, no puede ser negativo)
  - status: Estado de pago ("pagado" o "no pagado"), default: no pagado
*/

const ordersSchema = new Schema(
  {
    idCustomer: {
      type: Schema.Types.ObjectId,
      ref: "Customers",
      required: true, // Cliente obligatorio
    },

    products: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "Products",
          required: true, // Producto obligatorio
        },
        quantity: {
          type: Number,
          required: true, // Cantidad obligatoria
          min: 1, // No permitir cantidad <= 0
          validate: {
            validator: Number.isInteger,
            message: "La cantidad debe ser un número entero",
          },
        },
        subtotal: {
          type: Number,
          required: true, // Subtotal obligatorio
          min: 0, // Subtotal no puede ser negativo
        },
      },
    ],

    total: {
      type: Number,
      required: true, // Total obligatorio
      min: 0, // Total no puede ser negativo
    },

    status: {
      type: String,
      enum: ["pagado", "no pagado"],
      default: "no pagado",
    },
  },
  {
    timestamps: true, // Guarda fecha de creación/actualización
  }
);

export default model("Orders", ordersSchema);
