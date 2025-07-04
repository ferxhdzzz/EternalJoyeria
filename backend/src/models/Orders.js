import { Schema, model } from "mongoose";

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
        },
        subtotal: {
          type: Number,
          required: true,
        },
      },
    ],
    total: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["pagado", "no pagado"], 
      default: "no pagado",
    },
  },
  {
    timestamps: true,
  }
);

export default model("Orders", ordersSchema);
