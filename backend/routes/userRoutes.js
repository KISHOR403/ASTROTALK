const express = require('express');
const router = express.Router();
const {
    getUserProfile,
    updateUserProfile,
    getBirthDetails,
    getReports,
    getChatHistory
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);
router.get('/birth-details', protect, getBirthDetails);
router.get('/reports', protect, getReports);
router.get('/chats', protect, getChatHistory);

module.exports = router;
