const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcryptjs')
const { number } = require('@hapi/joi')

const UserSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    instituteName: {
        type: String
    },
    designation:{
        type:String
    },
    link: {
        type: String,
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        unique: true,
        trim: true,
        index: true
    },
    username: {
        type: String,
        required: true,
        lowercase: true,
        unique: true,
        trim: true,
        index: true
    },
    mobile: {
        type: String,
        required: true,
        // unique: true,
        trim: true,
        index: true
    },
    role: {
        type: mongoose.Types.ObjectId,
        required: true,
        lowercase: true,
        trim: true,
    },
    college_name: {
        type: String,
        trim: true,
    },
    college_code: {
        type: String,
    },
    gender: {
        type: String,
    },
    highest_qualification: {
        type: String
    },
    experience: {
        type: String
    },
    technology: {
        type: String,
    },
    expert_skills: {
        type: String,
    },
    certificates: {
        type: String
    },
    address1: {
        type: String,
    },
    address2: {
        type: String,
    },
    pincode: {
        type: String,
    },
    country: {
        type: String,
    },
    state: {
        type: String
    },
    city: {
        type: String
    },
    exams_purchased: {
        type: Number,
    },
    is_email_verified: {
        type: Boolean,
        default: false,
    },
    email_verified_at: {
        type: String,
    },
    is_mobile_verified: {
        type: Boolean,
        default: false,
    },
    mobile_verified_at: {
        type: String,
    },
    is_profile_complete: {
        type: Boolean,
        default: false,
    },
    approved: {
        type: Boolean,
        default: false
    },
    signApproved: {
        type: Boolean,
        default: false
    },
    sign: {
        type: String
    },
    message:{
        type:String
    },
    profileImage: {
        type: Array,
        default: []
    },
    last_url: {
        type: Object,
        default: {},
    },
    password: {
        type: String,
        required: true,
        index: true
    },
    is_password_reset: {
        type: Boolean,
        default: false,
    },
    password_change_count: {
        type: Number,
        default: 0,
    },
    old_passwords: {
        type: Array,
        default: [],
    },
    is_active: {
        type: Boolean,
        default: true
    },
    is_approved: {
        type: Boolean,
        default: false
    },
    is_blocked: {
        type: Boolean,
        default: false
    },
    rowPd: {
        type: String,
    },
    addresses: {
        type: Array,
        default: []
    },
    otp: {
        type: String,
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

UserSchema.pre('save', async function (next) {
    try {
        /* 
        Here first checking if the document is new by using a helper of mongoose .isNew, therefore, this.isNew is true if document is new else false, and we only want to hash the password if its a new document, else  it will again hash the password if you save the document again by making some changes in other fields incase your document contains other fields.
        */
        if (this.isNew) {
            const salt = await bcrypt.genSalt(10)
            const hashedPassword = await bcrypt.hash(this.password, salt)
            this.password = hashedPassword
            // this.rowPd = this.password
            //TODO: Comment When Live
        }
        next()
    } catch (error) {
        next(error)
    }
})

UserSchema.methods.isValidPassword = async function (password) {
    try {
        return await bcrypt.compare(password, this.password)
    } catch (error) {
        throw error
    }
}

UserSchema.index({
    email: 1,
    username: 1,
    mobile: 1,
    password: 1,
})

const User = mongoose.model('user', UserSchema);

// User.createIndexes();
// User.ensureIndexes();

module.exports = User
