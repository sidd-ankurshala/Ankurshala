const mongoose = require('mongoose')

const transactionSchema = new mongoose.Schema({
    fromUserId: {
        type: String,
        required: true
    },
    appId: {
        type: String,
        required: true
    },
    toUserId: String,
    toServiceId: String,
    amount: {
        type: Number,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Success', 'Aborted', 'Failed', 'Invalid', 'Refund'],
        default: 'Pending'
    },
    createdAt: {
        type: Date
    },
    updatedAt: {
        type: Date
    },
    metadata: {
        type: Map,
        of: String,
    }
});

// Pre-save middleware for createdAt and updatedAt
transactionSchema.pre('save', function (next) {
    const now = new Date();

    if (!this.createdAt) {
        this.createdAt = now;
    }
    this.updatedAt = now;

    next();
});

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;
