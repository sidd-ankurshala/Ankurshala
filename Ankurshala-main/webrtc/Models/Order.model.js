const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TableSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "user",
  },
  orders: {
    type: Array,
  },
  pending:{
    type: Boolean,
    default: true,
  },
  scheduled: {
    type:Boolean,
    default:false,
  },
  expiry:{
    type:Date
  },
  is_active: {
    type: Boolean,
    default: true,
  },
  billing_detail:{
    type:JSON
  },
  payment_method:{
    type:String,
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

const Table = mongoose.model("order", TableSchema);
module.exports = Table;
