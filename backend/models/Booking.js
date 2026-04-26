const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    astrologer: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Astrologer'
    },
    startTime: {
        type: Date,
        required: true
    },
    duration: {
        type: Number, // in minutes
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: ['pending', 'accepted', 'scheduled', 'completed', 'cancelled', 'rejected'],
        default: 'pending'
    },

    price: {
        type: Number,
        required: true
    },
    topic: {
        type: String,
        required: true,
        default: 'General Consultation'
    },
    paymentStatus: {
        type: String,
        required: true,
        enum: ['pending', 'paid', 'failed'],
        default: 'pending'
    }
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
