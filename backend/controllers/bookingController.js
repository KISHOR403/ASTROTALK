const Booking = require('../models/Booking');
const Astrologer = require('../models/Astrologer');

// @desc    Create a new booking
// @route   POST /api/bookings
// @access  Private (Client)
const createBooking = async (req, res) => {
    const { astrologerId, slotId, startTime, duration, price, topic } = req.body;

    try {
        // 1. Find astrologer
        const astrologer = await Astrologer.findById(astrologerId);
        if (!astrologer) {
            return res.status(404).json({ message: 'Astrologer not found' });
        }

        // 2. Find and validate slot
        const slotIndex = astrologer.availabilitySlots.findIndex(
            slot => slot._id.toString() === slotId && !slot.isBooked
        );

        if (slotIndex === -1) {
            return res.status(400).json({ message: 'Slot not available or already booked' });
        }

        // 3. Mark slot as booked
        astrologer.availabilitySlots[slotIndex].isBooked = true;
        await astrologer.save();

        // 4. Create booking
        const booking = await Booking.create({
            user: req.user._id,
            astrologer: astrologerId,
            startTime, // This should normally match the slot's start time
            duration,
            price,
            topic: topic || 'General Consultation'
        });

        // 5. Populate user info for notification
        const populatedBooking = await Booking.findById(booking._id).populate('user', 'name');

        // 6. Emit notification to astrologer
        if (req.io) {
            req.io.to(astrologer.user.toString()).emit('new_notification', {
                type: 'new_booking',
                message: `New booking from ${populatedBooking.user.name}: ${topic || 'General Consultation'}`,
                bookingId: booking._id,
                timestamp: new Date()
            });
        }

        res.status(201).json(booking);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get logged in user bookings
// @route   GET /api/bookings/user
// @access  Private (Client)
const getUserBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ user: req.user._id })
            .populate('astrologer', 'title')
            .populate({
                path: 'astrologer',
                populate: { path: 'user', select: 'name' }
            });
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get bookings for an astrologer
// @route   GET /api/bookings/astrologer
// @access  Private (Astrologer)
const getAstrologerBookings = async (req, res) => {
    try {
        // Find the astrologer profile for current user
        const astrologerProfile = await Astrologer.findOne({ user: req.user._id });

        if (!astrologerProfile) {
            return res.status(404).json({ message: 'Astrologer profile not found' });
        }

        const bookings = await Booking.find({ astrologer: astrologerProfile._id })
            .populate('user', 'name email');
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update booking status
// @route   PUT /api/bookings/:id/status
// @access  Private
const updateBookingStatus = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);

        if (booking) {
            booking.status = req.body.status || booking.status;
            const updatedBooking = await booking.save();
            res.json(updatedBooking);
        } else {
            res.status(404).json({ message: 'Booking not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update booking payment status to paid
// @route   PATCH /api/bookings/:id/pay
// @access  Private (Client)
const updateBookingToPaid = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id)
            .populate('user', 'name')
            .populate('astrologer');

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        booking.paymentStatus = 'paid';
        await booking.save();

        // Notify astrologer about payment
        if (req.io && booking.astrologer) {
            req.io.to(booking.astrologer.user.toString()).emit('new_notification', {
                type: 'payment_received',
                message: `Payment received from ${booking.user.name} for session: ${booking.topic}`,
                bookingId: booking._id,
                timestamp: new Date()
            });
        }

        res.json({ message: 'Payment status updated to paid', booking });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createBooking,
    getUserBookings,
    getAstrologerBookings,
    updateBookingStatus,
    updateBookingToPaid
};
