const mongoose = require("mongoose");
const Schema = mongoose.Schema

const TableSchema = new Schema({
  catalog_Id: {
    type: mongoose.Types.ObjectId
  },
  product_Id: {
    type: mongoose.Types.ObjectId
  },
  currentExamStatus: {
    type: String
  },
  user_Id: {
    type: mongoose.Types.ObjectId
  },
  exam_date: {
    type: Date
  },
  exam_start_time: {
    type: String
  },
  proctor_Id: {
    type: mongoose.Types.ObjectId
  },
  exam_code: {
    type: Number
  },
  exam_scheduled: {
    type: Boolean,
    default: false,
  },
  exam_rescheduled: {
    type: Number,
    default: 0,
  },
  exam_given: {
    type: Boolean,
    default: false
  },
  report_generated: {
    type: Boolean,
    default: false
  },
  certificate_alloted: {
    type: Boolean,
    default: true
  },
  is_active: {
    type: Boolean,
    default: true,
    index: true
  },
  created_at: {
    type: Date,
    default: Date.now()
  },
  created_by: {
    type: String,
  },
  updated_at: {
    type: Date,
  },
  updated_by: {
    type: String,
  },
});

TableSchema.index({
  product_code: 1,
  title: 1,
  product_id: 1,
  exam_start_date: 1,
  exam_start_time: 1,
  exam_end_time: 1,
  time_table_type: 1,
  is_active: 1
})

const Table = mongoose.model('TimeTable', TableSchema)

/* Table.createIndexes()
Table.ensureIndexes() */

module.exports = Table
