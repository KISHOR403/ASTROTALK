const User = require('../models/User');
const AstrologerProfile = require('../models/AstrologerProfile');
const { sendApprovalEmail, sendRejectionEmail } = require('../utils/sendEmail');

// @desc    Get all pending astrologers
// @route   GET /api/admin/astrologers/pending
// @access  Private/Admin
const getPendingAstrologers = async (req, res) => {
    try {
        const pending = await AstrologerProfile.find({ status: 'pending' }).populate('userId', 'name email');
        res.json(pending);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Approve astrologer
// @route   PATCH /api/admin/astrologers/:id/approve
// @access  Private/Admin
const approveAstrologer = async (req, res) => {
    try {
        const profile = await AstrologerProfile.findById(req.params.id).populate('userId');
        if (!profile) {
            return res.status(404).json({ message: 'Astrologer profile not found' });
        }

        profile.status = 'approved';
        await profile.save();

        const user = await User.findById(profile.userId._id);
        user.status = 'approved';
        await user.save();

        // Send approval email
        await sendApprovalEmail(user.email, user.name);

        res.json({ message: 'Astrologer approved' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Reject astrologer
// @route   PATCH /api/admin/astrologers/:id/reject
// @access  Private/Admin
const rejectAstrologer = async (req, res) => {
    try {
        const profile = await AstrologerProfile.findById(req.params.id).populate('userId');
        if (!profile) {
            return res.status(404).json({ message: 'Astrologer profile not found' });
        }

        profile.status = 'rejected';
        await profile.save();

        const user = await User.findById(profile.userId._id);
        user.status = 'rejected';
        await user.save();

        // Send rejection email
        await sendRejectionEmail(user.email, user.name);
        res.json({ message: 'Astrologer rejected' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// @desc    Get dashboard stats
// @route   GET /api/admin/stats
// @access  Private/Admin
const getDashboardStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments({ role: 'client' });
        const totalAstrologers = await User.countDocuments({ role: 'astrologer', status: 'approved' });
        const pendingApprovals = await AstrologerProfile.countDocuments({ status: 'pending' });
        
        // Mock revenue and chats for now
        const totalChats = 52100; 
        const totalRevenue = 240000;

        res.json({
            users: totalUsers,
            astrologers: totalAstrologers,
            chats: totalChats,
            revenue: totalRevenue,
            pendingApprovals
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const Activity = require('../models/Activity');

// @desc    Get recent activities
// @route   GET /api/admin/activities
// @access  Private/Admin
const getRecentActivities = async (req, res) => {
    try {
        const activities = await Activity.find().sort({ createdAt: -1 }).limit(5);
        res.json(activities);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all astrologers
// @route   GET /api/admin/astrologers
// @access  Private/Admin
const getAllAstrologers = async (req, res) => {
    try {
        const astrologers = await AstrologerProfile.find().populate('userId', 'name email status');
        res.json(astrologers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const Booking = require('../models/Booking');

// @desc    Get astrologer logs (bookings)
// @route   GET /api/admin/astrologers/:id/logs
// @access  Private/Admin
const getAstrologerLogs = async (req, res) => {
    try {
        const logs = await Booking.find({ astrologerId: req.params.id })
            .populate('clientId', 'name email')
            .sort({ createdAt: -1 });
        res.json(logs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all chat logs (bookings with chat history)
// @route   GET /api/admin/chats
// @access  Private/Admin
const getAllChatLogs = async (req, res) => {
    try {
        const chats = await Booking.find()
            .populate('clientId', 'name email')
            .populate('astrologerId', 'userId')
            .sort({ updatedAt: -1 });
            
        // We need to get the user name for the astrologer since astrologerId points to AstrologerProfile
        // This populate might need careful handling depending on the schema
        res.json(chats);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const Message = require('../models/Message');

// @desc    Get chat messages for a specific booking (Admin view)
// @route   GET /api/admin/chats/:bookingId
// @access  Private/Admin
const getChatMessageLogs = async (req, res) => {
    try {
        const messages = await Message.find({ bookingId: req.params.bookingId })
            .populate('senderId', 'name email')
            .sort({ createdAt: 1 });
        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getPendingAstrologers,
    getAllAstrologers,
    approveAstrologer,
    rejectAstrologer,
    getDashboardStats,
    getRecentActivities,
    getAstrologerLogs,
    getAllChatLogs,
    getChatMessageLogs
};

