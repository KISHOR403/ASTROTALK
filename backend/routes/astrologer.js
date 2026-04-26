const express = require('express');
const router = express.Router();
const {
    completeOnboarding,
    getMyProfile,
    goOnline,
    goOffline,
    getApprovedAstrologers,
    getAstrologerDashboard,
    getAstrologerEarnings,
    getChatRequests,
    acceptChatRequest,
    rejectChatRequest
} = require('../controllers/astrologerController');
const { protect } = require('../middleware/authMiddleware');

// Public routes
router.get('/list', getApprovedAstrologers);

// Protected routes
router.post('/onboarding', protect, completeOnboarding);
router.get('/profile', protect, getMyProfile);
router.patch('/go-online', protect, goOnline);
router.patch('/go-offline', protect, goOffline);
router.get('/dashboard', protect, getAstrologerDashboard);
router.get('/earnings', protect, getAstrologerEarnings);

// Chat Requests
router.get('/requests', protect, getChatRequests);
router.patch('/requests/:id/accept', protect, acceptChatRequest);
router.patch('/requests/:id/reject', protect, rejectChatRequest);

module.exports = router;

