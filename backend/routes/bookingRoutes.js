const express = require('express');
const router = express.Router();
const {
    createBooking,
    getUserBookings,
    getAstrologerBookings,
    updateBookingStatus,
    updateBookingToPaid
} = require('../controllers/bookingController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/', protect, authorize('client'), createBooking);
router.get('/user', protect, getUserBookings);
router.get('/astrologer', protect, getAstrologerBookings);
router.put('/:id/status', protect, updateBookingStatus);
router.patch('/:id/pay', protect, updateBookingToPaid);

module.exports = router;
