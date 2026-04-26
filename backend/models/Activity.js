const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    user: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['astrologer_application', 'complaint', 'system', 'payout'],
        default: 'astrologer_application'
    },
    color: {
        type: String,
        default: 'text-primary'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Activity', activitySchema);
