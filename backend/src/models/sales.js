import { Schema, model } from "mongoose";

const salesSchema = new Schema(
  {
    idOrder: {
        type: Schema.Types.ObjectId,
        ref: "Orders",
        required: true,
      },
  
    address: {
      type: String,
      required: true,
     
    },
  
  },
  {

=======
    strict: false

  }
);

export default model("sales", salesSchema);
