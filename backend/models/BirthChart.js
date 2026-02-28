const mongoose = require('mongoose');

const birthChartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    },
    dateOfBirth: {
        type: String,
        required: true
    },
    timeOfBirth: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    coordinates: {
        type: String,
        required: true
    },
    chartData: {
        type: mongoose.Schema.Types.Mixed,
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('BirthChart', birthChartSchema);
