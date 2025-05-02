const mongoose = require('mongoose')
const ProductsController = require('../Controllers/Products.controller')
const Schema = mongoose.Schema

const TableSchema = new Schema({
    productid: {
        type: mongoose.Types.ObjectId,
        trim: true
    },
    old_exam_date: {
        type: Date,
        required: true,
        trim: true
    },
    info: {
        type: Object,
    },
    user_id: {
        type: mongoose.Types.ObjectId
    },
    is_active: {
        type: Boolean,
        default: true
    },
    status: {
        type: String,
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
})

TableSchema.pre('save', async function (next) {
    try {
        /* 
        Here first checking if the document is new by using a helper of mongoose .isNew, therefore, this.isNew is true if document is new else false, and we only want to hash the password if its a new document, else  it will again hash the password if you save the document again by making some changes in other fields incase your document contains other fields.
        */
        if (this.isNew) {
            this.created_at = Date.now()
        } else {
            this.updated_at = Date.now()
        }
        next()
    } catch (error) {
        next(error)
    }
})

const Table = mongoose.model('examreschedule', TableSchema)
module.exports = Table