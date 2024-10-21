const mongoose = require("mongoose");

const TableSchema = mongoose.Schema(
  {
    tableNumber: { type: String, require: true },
  },
  { timestamps: true }
);
const Tables = mongoose.model("tables", TableSchema);
module.exports = Tables;