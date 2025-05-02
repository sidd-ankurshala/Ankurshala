const { boolean } = require("@hapi/joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TableSchema = new Schema({
  userId: {
    type: mongoose.Types.ObjectId,
  },
  signature: {
    type: String
  },
  apply: {
    type: Boolean
  },
  signApproved:{
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

const Table = mongoose.model("agreement", TableSchema);
module.exports = Table;
