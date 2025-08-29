// backend/src/models/sales.js
import mongoose from "mongoose";
const { Schema } = mongoose;

/*
  Sales
  - idOrder: referencia a la orden
  - idCustomers: referencia al cliente
  - address: snapshot de envío (solo la línea escrita)
*/

const salesSchema = new Schema(
  {
    idOrder: {
      type: Schema.Types.ObjectId,
      ref: "Orders",
      required: true,
    },
    idCustomers: {
      type: Schema.Types.ObjectId,
      ref: "Customers",
      required: true, // si prefieres permitir nulo, cambia a false o elimina required
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    strict: false,
    timestamps: true, // opcional: createdAt/updatedAt
  }
);

// Evita OverwriteModelError si el archivo se carga más de una vez
export default mongoose.models["sales"] ||
       mongoose.model("sales", salesSchema, "sales");
