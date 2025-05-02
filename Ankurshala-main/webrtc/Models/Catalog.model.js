const mongoose = require('mongoose')
const Schema = mongoose.Schema

const TableSchema = new Schema({
    product_code: {
        type: String,
        required: true,
        uppercase: true,
        unique: true,
        trim: true,
        index: true
    },
    product_type: {
        type: String
    },
    area_of_interest: {
        type: String
    },
    title: {
        type: String
    },
    available_for: {
        type: String
    },
    short_description: {
        type: String
    },
    full_description: {
        type: String
    },
    Exam_type:{
        type:String
    },
    level: {
        type: String
    },
    technology: {
        type: String
    },
    solution: {
        type: String
    },
    delivery_method: {
        type: String
    },
    price: {
        type: String
    },
    catalogImage: {
        type: Array,
        default: []
    },
    catalogVideo: {
        type: String
    },
    catalogImageByLink: {
        type: String
    },
    catalogExpiryDate: {
        type:String,
    },
    about: {
        type: Object,
        default: {},
    },
    courseOutline: {
        type: Array,
        default: []
    },
    prerequisites: {
        type: String
    },
    labInfo: {
        type: String
    },
    learningPath: {
        type: Array,
        default: []
    },
    includes: {
        type: String
    },
    quantity:{
        type:Number,
        default:1,
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
    title : 1,
    product_type:1,
    price: 1,
    product_code: 1,
    area_of_interest: 1,
    quantity:1,
});

const Table = mongoose.model('catalog', TableSchema)
module.exports = Table