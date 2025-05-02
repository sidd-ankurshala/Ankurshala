const mongoose = require('mongoose')
const Schema = mongoose.Schema

const TableSchema = new Schema({
  student: {
    type: mongoose.Types.ObjectId,
    required: true,
    trim: true,
    index: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  certificate_number: {
    type: String,
    uppercase: true,
    required: true,
    trim: true,
    index: true
  },
  valid_till: {
    type: String
  },
  exam: {
    type: mongoose.Types.ObjectId,
    required: true,
    trim: true,
    index: true
  },
  is_active: {
    type: Boolean,
    default: true
  },
  status: {
    type: String
  },
  created_at: {
    type: Date,
    default: Date.now()
  },
  created_by: {
    type: String,
    default: 'self'
  },
  updated_at: {
    type: Date,
    default: Date.now()
  },
  updated_by: {
    type: String,
    default: 'self'
  },
});

TableSchema.index({
  student: 1,
  certificate_number: 1,
});

const Table = mongoose.model('certificate', TableSchema)
module.exports = Table