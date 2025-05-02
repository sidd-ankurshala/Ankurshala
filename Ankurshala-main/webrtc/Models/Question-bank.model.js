const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TableSchema = mongoose.Schema({
  question: {
    type: String,
  },
  question_refrence: {
    type: String,
  },
  regional_available: {
    type: String,
  },    
  regional_language: {
    type: String,  
  },
  question_regional: {
    type: String,
  },
  question_type: {
    type: String,
  },
  is_verified: {
    type: Boolean,
    defaukt: false,
  },
  marks_alloted: {
    type: Number,
    default: 1,
  },
  difficulty_level: {
    type: String,
    default: "easy",
  },
  catalog_title: {
    type: Schema.Types.ObjectId,
    ref: "catalog", 
  },
  no_of_options: {
    type: Number,
  },
  options: {
    type: Array,
    default: [],
  },
  options_regional: {
    type: Array,
    default: [],
  },
  correct_option: {
    type: String,
  },
  correct_options: {
    type: Array,
  },
  correct_option_index: {
    type: Number,
  },
  correct_options_indexes: {
    type: Array,
    default: [],
  },
  is_active: {
    type: Boolean,
    default: true,
    index: true,
  },
  created_at: {
    type: Date,
  },
  created_by: String,
  updated_at: {
    type: Date,
  },
  updated_by: String,
  filename: String,
  path: String,
});

TableSchema.index({
  question_refrence: 1,
  regional_language: 1,
  question_type: 1,
  marks_alloted: 1,
  difficulty_level: 1,
  program: 1,
  is_active: 1,
});

const Table = mongoose.model("Question", TableSchema);

// Table.createIndexes();
// Table.ensureIndexes();

module.exports = Table;
