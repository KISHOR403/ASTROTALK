const mongoose = require('mongoose');

const horoscopeSchema = new mongoose.Schema({
    sign: {
        type: String,
        required: true,
        index: true
    },
    date: {
        type: String,
        required: true,
        index: true
    },
    daily: {
        type: String,
        required: true
    },
    mood: {
        type: String,
        required: true
    },
    colour: {
        type: String,
        required: true
    },
    lucky_number: {
        type: Number,
        required: true
    },
    compatible_sign: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Horoscope', horoscopeSchema);
