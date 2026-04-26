const express = require('express');
const router = express.Router();
const {
    completeOnboarding,
    getMyProfile,
    goOnline,
    goOffline,
    getApprovedAstrologers
} = require('../controllers/astrologerController');
const { protect } = require('../middleware/authMiddleware');

// Public routes
router.get('/list', getApprovedAstrologers);

// Protected routes
router.post('/onboarding', protect, completeOnboarding);
router.get('/profile', protect, getMyProfile);
router.patch('/go-online', protect, goOnline);
router.patch('/go-offline', protect, goOffline);

module.exports = router;
