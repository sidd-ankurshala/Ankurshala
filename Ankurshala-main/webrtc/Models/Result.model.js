const mongoose = require("mongoose");
const TableSchema = mongoose.Schema({
    exam_id: {
        type: mongoose.Types.ObjectId,
    },
    user_id: {
        type: mongoose.Types.ObjectId,
    },
    user: {
        type: JSON,
    },
    warnings_left: {
        type: Number,
        default: 0
    },
    time_left: {
        type: Number,
        default: 0
    },
    last_warning: {
        type: String
    },
    login_attempts: {
        type: Number,
        default: 0
    },
    scoredMarks: {
        type: Number,
        default: 0
    },
    maxMarks: {
        type: Number,
        default: 0
    },
    submitted: {
        type: Boolean,
        default: false,
    },
    is_active: {
        type: Boolean,
        default: true
    },
    created_at: {
        type: Date
    },
    created_by: String,
    updated_at: {
        type: Date
    },
    updated_by: String
}, {
    writeConcern: {
        w: 'majority',
        j: true,
        wtimeout: 20000
    }
});

const Table = mongoose.model('Result', TableSchema);
module.exports = Table