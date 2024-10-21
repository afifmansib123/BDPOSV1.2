const mongoose = require("mongoose");

const BillSchema = mongoose.Schema(
  {
    customerName: { type: String, require: true }, // is being used as table number
    customerPhoneNumber: { type: String, require: true },
    paymentMode: { type: String, require: true },
    cartItems: { type: Array, require: true },
    subTotal: { type: Number, require: true },
    tax: { type: Number, require: true },
    totalAmount: { type: Number, require: true },
    checked: { type: Boolean, require:true,  default:false},
  },
  { timestamps: true }
);
const Bill = mongoose.model("bills", BillSchema);
module.exports = Bill;
