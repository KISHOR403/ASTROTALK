const Message = require('../models/Message');

// @desc    Get chat history for a booking
// @route   GET /api/chat/:bookingId
// @access  Private
const getChatHistory = async (req, res) => {
    try {
        const messages = await Message.find({ booking: req.params.bookingId })
            .populate('sender', 'name')
            .sort({ createdAt: 1 });
        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getChatHistory
};
