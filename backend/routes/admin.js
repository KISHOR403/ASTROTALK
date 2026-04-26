const express = require('express');
const router = express.Router();
const {
    getPendingAstrologers,
    getAllAstrologers,
    approveAstrologer,
    rejectAstrologer,
    getDashboardStats,
    getRecentActivities,
    getAstrologerLogs,
    getAllChatLogs,
    getChatMessageLogs
} = require('../controllers/adminController');
const { protect, isAdmin } = require('../middleware/authMiddleware');

router.get('/astrologers/pending', protect, isAdmin, getPendingAstrologers);
router.get('/astrologers', protect, isAdmin, getAllAstrologers);
router.get('/astrologers/:id/logs', protect, isAdmin, getAstrologerLogs);
router.get('/chats', protect, isAdmin, getAllChatLogs);
router.get('/chats/:bookingId', protect, isAdmin, getChatMessageLogs);
router.patch('/astrologers/:id/approve', protect, isAdmin, approveAstrologer);
router.patch('/astrologers/:id/reject', protect, isAdmin, rejectAstrologer);
router.get('/stats', protect, isAdmin, getDashboardStats);
router.get('/activities', protect, isAdmin, getRecentActivities);


module.exports = router;
