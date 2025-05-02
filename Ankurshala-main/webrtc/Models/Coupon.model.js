const { required } = require("@hapi/joi/lib/base");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TableSchema = new Schema({
  userId:{
    type:mongoose.Types.ObjectId,
    required:true,
  },
  userEmail: {
    type: String,
    required: true
  },
  coupon_name: {
    type: String,
    required: true
  },
  coupon_code: {
    type: String,
    required: true
  },
  discount_type: {
    type: String,
    required: true
  },
  discount: {
    type: Number
  },
  catalog_list: {
    type: Array
  },
  expiry_date: {
    type: String,
  },
  status: {
    type: Boolean,
    default: false,
  },
  is_active: {
    type: Boolean,
    default: true,
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

const Table = mongoose.model("coupon", TableSchema);
module.exports = Table;
