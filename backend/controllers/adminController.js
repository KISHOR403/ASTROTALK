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

module.exports = {
    getPendingAstrologers,
    approveAstrologer,
    rejectAstrologer,
    getDashboardStats
};

