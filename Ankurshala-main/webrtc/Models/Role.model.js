const mongoose = require('mongoose')
const Schema = mongoose.Schema

const TableSchema = new Schema({
  name: { type: String, index: true, unique: true },
  description: {
    type: String
  },
  permission: {
    type: {
      event: {
        core: Boolean,
        create: Boolean,
        edit: Boolean,
        list: Boolean,
        delete: Boolean,
        schedule: Boolean,
      },
      member: {
        core: Boolean,
        create: Boolean,
        edit: Boolean,
        list: Boolean,
        delete: Boolean,
      },
      user: {
        core: Boolean,
        create: Boolean,
        edit: Boolean,
        list: Boolean,
        delete: Boolean,
      },
      role: {
        core: Boolean,
        create: Boolean,
        edit: Boolean,
        list: Boolean,
        delete: Boolean,
        permission: Boolean,
      },
    }
  },

  is_active: {
    type: Boolean,
    default: true,
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
    default: 'superadmin'
  },
  updated_at: {
    type: Date,
    default: Date.now()
  },
  updated_by: {
    type: String,
    default: 'superadmin'
  },
})

TableSchema.index({
  name: 1,
  vendor: 1,
})

const Table = mongoose.model('role', TableSchema)


module.exports = Table