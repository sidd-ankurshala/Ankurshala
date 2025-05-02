const mongoose = require('mongoose')
const Schema = mongoose.Schema

const LeadSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    gender: {
        type: String,
        lowercase: true,
        trim: true,
    },
    dob: {
        type: String,
    },
    email: {
        type: String,
        lowercase: true,
        trim: true,
    },
    mobile: {
        type: String,
        required: true,
        trim: true,
    },
    address: {
        type: String,
        default: 'NIL',
    },
    city: {
        type: String,
        default: 'NIL',
    },
    state: {
        type: String,
        default: 'NIL',
    },
    pincode: {
        type: String,
        default: 'NIL',
    },
    country: {
        type: String,
        default: 'NIL',
    },
    occupation: {
        type: String,
        default: 'NIL',
    },
    purpose: {
        type: String,
        default: 'NIL',
    },
    source: {
        type: String,
        default: 'NIL',
    },
    interested_in: {
        type: String,
        default: 'NIL',
    },
    from_file: {
        type: String,
        default: 'NIL',
    },
    owner: {
        type: Array,
        default: []
    },
    status: {
        type: String,
        default: 'Created'
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

const Lead = mongoose.model('lead', LeadSchema)
module.exports = Lead