const mongoose = require('mongoose');

const walletSchema = new mongoose.Schema({
    appId: {
        type: String,
        required: true,
    },
    userId: {
        type: String,
        required: true,
        unique: true
    },
    wallets: {
        type: Map,
        of: Number,
        default: {}
    },
    createdAt: {
        type: Date
    },
    updatedAt: {
        type: Date
    }
});

// Pre-save middleware to handle createdAt and updatedAt
walletSchema.pre('save', function (next) {
    const now = new Date();

    if (!this.createdAt) {
        this.createdAt = now;
    }
    this.updatedAt = now;

    next();
});

const Wallet = mongoose.model('Wallet', walletSchema);

module.exports = Wallet;
