const mongoose = require("mongoose");
const Schema = mongoose.Schema

const TableSchema = new Schema({
    Date:{
        type:Date
    },
    Slots:{
        type:Array
    },
    is_active: {
        type: Boolean,
        default: true
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
})

const Table = mongoose.model("Slots", TableSchema)

module.exports = Table