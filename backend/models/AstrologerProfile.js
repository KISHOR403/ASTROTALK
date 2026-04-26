const mongoose = require('mongoose');

const astrologerProfileSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    specialization: {
        type: [String],
        default: []
    },
    experience: {
        type: Number,
        default: 0
    },
    languages: {
        type: [String],
        default: []
    },
    pricePerMin: {
        type: Number,
        default: 0
    },
    bio: {
        type: String,
        default: ''
    },
    profilePhoto: {
        type: String,
        default: ''
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    isOnline: {
        type: Boolean,
        default: false
    },
    totalRatings: {
        type: Number,
        default: 0
    },
    averageRating: {
        type: Number,
        default: 0
    },
    totalEarnings: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

module.exports = mongoose.model('AstrologerProfile', astrologerProfileSchema);
