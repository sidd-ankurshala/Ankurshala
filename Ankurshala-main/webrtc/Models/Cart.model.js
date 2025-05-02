const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TableSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "user",
  },
  productId: {
    type: Schema.Types.ObjectId,
    ref: "catalog",
  },
  quantity: {
    type: Number,
    default: 1,
  },
  order_confirm:{
    type:Boolean,
    default:false
  },
  is_active: {
    type: Boolean,
    default: true
},
  created_at: {
    type: Date,
    default: Date.now(),
  },
  created_by: {
    type: String,
    default: "self",
  },
  updated_at: {
    type: Date,
    default: Date.now(),
  },
  updated_by: {
    type: String,
    default: "self",
  },
});

const Table = mongoose.model("cart", TableSchema);
module.exports = Table;
