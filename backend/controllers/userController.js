const User = require('../models/User');

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update user profile & birth details
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (user) {
            user.name = req.body.name || user.name;
            user.email = req.body.email || user.email;
            
            if (req.body.birthDetails) {
                user.birthDetails = { ...user.birthDetails, ...req.body.birthDetails };
            }

            const updatedUser = await user.save();
            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role,
                birthDetails: updatedUser.birthDetails,
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get saved birth details
// @route   GET /api/users/birth-details
// @access  Private
const getBirthDetails = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('birthDetails');
        if (user) {
            res.json(user.birthDetails || {});
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get user reports
// @route   GET /api/users/reports
// @access  Private
const getReports = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('reports');
        if (user) {
            // Returning mock reports if none exist
            const reports = user.reports.length > 0 ? user.reports : [
                { title: 'Natal Chart Analysis', url: '#', date: new Date() },
                { title: 'Yearly Prediction 2026', url: '#', date: new Date() }
            ];
            res.json(reports);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get chat history
// @route   GET /api/users/chats
// @access  Private
const getChatHistory = async (req, res) => {
    try {
        // Mock chat history
        const chatHistory = [
            { id: '1', astrologerName: 'Dr. Arjun', lastMessage: 'The stars look favorable.', date: new Date() },
            { id: '2', astrologerName: 'Priya Sharma', lastMessage: 'Thank you for the consultation.', date: new Date() }
        ];
        res.json(chatHistory);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getUserProfile,
    updateUserProfile,
    getBirthDetails,
    getReports,
    getChatHistory
};
