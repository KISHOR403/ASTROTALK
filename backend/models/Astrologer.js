const mongoose = require('mongoose');

const astrologerSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    title: {
        type: String,
        required: true
    },
    avatar: {
        type: String,
        default: '✨'
    },
    specializations: {
        type: [String],
        required: true
    },
    experience: {
        type: Number,
        required: true
    },
    rating: {
        type: Number,
        default: 5.0
    },
    totalConsultations: {
        type: Number,
        default: 0
    },
    pricePerMinute: {
        type: Number,
        required: true
    },
    bio: {
        type: String,
        required: true
    },
    languages: {
        type: [String],
        required: true
    },
    isAvailable: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Astrologer', astrologerSchema);
