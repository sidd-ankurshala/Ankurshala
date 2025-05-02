const mongoose = require('mongoose')
const Schema = mongoose.Schema

const TableSchema = new Schema({
    user_id:{
        type:mongoose.Types.ObjectId,
    },
    product_id:{
        type:mongoose.Types.ObjectId,
    },
    message:{
        type:String,
    },
    read:{
        type:Boolean,
        default:false
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


const Table = mongoose.model('notification', TableSchema)
module.exports = Table