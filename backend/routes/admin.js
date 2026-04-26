const express = require('express');
const router = express.Router();
const {
    getPendingAstrologers,
    approveAstrologer,
    rejectAstrologer,
    getDashboardStats
} = require('../controllers/adminController');
const { protect, isAdmin } = require('../middleware/authMiddleware');

router.get('/astrologers/pending', protect, isAdmin, getPendingAstrologers);
router.patch('/astrologers/:id/approve', protect, isAdmin, approveAstrologer);
router.patch('/astrologers/:id/reject', protect, isAdmin, rejectAstrologer);
router.get('/stats', protect, isAdmin, getDashboardStats);


module.exports = router;
