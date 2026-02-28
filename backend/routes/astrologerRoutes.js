const express = require('express');
const router = express.Router();
const {
    getAllAstrologers,
    getAstrologerById,
    updateAvailability,
    getAstrologerDashboard,
    updateAvailabilitySlots,
    getAstrologerEarnings,
    getMyProfile,
    updateAstrologerProfile
} = require('../controllers/astrologerController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', getAllAstrologers);
router.get('/dashboard', protect, authorize('astrologer'), getAstrologerDashboard);
router.get('/earnings', protect, authorize('astrologer'), getAstrologerEarnings);
router.get('/me', protect, authorize('astrologer'), getMyProfile);
router.put('/profile', protect, authorize('astrologer'), updateAstrologerProfile);
router.get('/:id', getAstrologerById);
router.put('/availability', protect, authorize('astrologer'), updateAvailability);
router.post('/availability/slots', protect, authorize('astrologer'), updateAvailabilitySlots);

module.exports = router;
