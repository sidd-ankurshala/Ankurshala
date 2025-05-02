const mongoose = require("mongoose");
const Schema = mongoose.Schema

const TableSchema = new Schema({
    catalog_Id: { 
        type: mongoose.Types.ObjectId 
    },
    user_Id: { 
        type: mongoose.Types.ObjectId 
    },
    scheduled: {
        type: Boolean,
        default: false
    },
    code:{
        type:Number
    },
    request:{
        type:Boolean,
        default:false
    },
    is_active: {
        type: Boolean,
        default: true,
    },
    purchase_date:{
        type:Date,
        default:Date.now()
    },
    is_expired:{
        type:Boolean,
        default:false
    },
    expiry_date:{
        type:Date
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


const Table = mongoose.model('Product', TableSchema)


module.exports = Table
