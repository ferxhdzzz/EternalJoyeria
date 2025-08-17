import { Schema, model } from "mongoose";

/*
  Esquema de Ventas (Sales)
  - idOrder: Referencia a la orden (obligatorio)
  - address: Dirección de envío (obligatoria, trim limpia espacios)
*/

const salesSchema = new Schema(
  {
    idOrder: {
      type: Schema.Types.ObjectId,
      ref: "Orders",
      required: true, // Debe existir una orden relacionada
    },

 idCustomers: {
      type: Schema.Types.ObjectId,
      ref: "Customers",
      required: true, // Cliente obligatorio
    },


    address: {
      type: String,
      required: true, // Dirección obligatoria
      trim: true,     // Limpia espacios innecesarios
    },


  },
  {
    strict: false, // Permitir flexibilidad en caso de campos extra
  }
);

export default model("sales", salesSchema);
