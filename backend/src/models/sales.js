import { Schema, model } from "mongoose";

/*
  Sales
  - idOrder: referencia a la orden
  - idCustomers: referencia al cliente
  - address: snapshot de envío
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
      required: true,
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { strict: false }
);

export default model("sales", salesSchema);
