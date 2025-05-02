const mongoose = require('mongoose')
const Schema = mongoose.Schema

const FileSchema = new Schema({
    file_name: {
        type: String,
        required: true,
    },
    original_name: {
        type: String,
    },
    location: {
        type: String,
    },
    purpose: {
        type: String,
        default: '',
    },
    owner: {
        type: Array,
        default: []
    },
    is_processed: {
        type: Boolean,
        default: false
    },
    is_approved: {
        type: Boolean,
        default: false
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

const File = mongoose.model('file', FileSchema)
module.exports = File