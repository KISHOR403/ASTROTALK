const Astrologer = require('../models/Astrologer');
const Booking = require('../models/Booking');

// @desc    Get all astrologers
// @route   GET /api/astrologers
// @access  Public
const getAllAstrologers = async (req, res) => {
    try {
        const astrologers = await Astrologer.find({}).populate('user', 'name email');
        res.json(astrologers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single astrologer
// @route   GET /api/astrologers/:id
// @access  Public
const getAstrologerById = async (req, res) => {
    try {
        const astrologer = await Astrologer.findById(req.params.id).populate('user', 'name email');

        if (astrologer) {
            res.json(astrologer);
        } else {
            res.status(404).json({ message: 'Astrologer not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update astrologer availability
// @route   PUT /api/astrologers/availability
// @access  Private/Astrologer
const updateAvailability = async (req, res) => {
    try {
        const astrologer = await Astrologer.findOne({ user: req.user._id });

        if (astrologer) {
            astrologer.isAvailable = req.body.isAvailable !== undefined ? req.body.isAvailable : astrologer.isAvailable;
            const updatedAstrologer = await astrologer.save();
            res.json(updatedAstrologer);
        } else {
            res.status(404).json({ message: 'Astrologer profile not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get astrologer dashboard stats
// @route   GET /api/astrologers/dashboard
// @access  Private/Astrologer
const getAstrologerDashboard = async (req, res) => {
    try {
        const astrologer = await Astrologer.findOne({ user: req.user._id });

        if (!astrologer) {
            return res.status(404).json({ message: 'Astrologer profile not found' });
        }

        const stats = {
            totalBookings: await Booking.countDocuments({ astrologer: astrologer._id }),
            todaysSessions: await Booking.countDocuments({
                astrologer: astrologer._id,
                startTime: {
                    $gte: new Date().setHours(0, 0, 0, 0),
                    $lt: new Date().setHours(23, 59, 59, 999)
                }
            }),
            totalEarnings: await Booking.aggregate([
                { $match: { astrologer: astrologer._id, status: 'completed' } },
                { $group: { _id: null, total: { $sum: '$price' } } }
            ]).then(res => res[0]?.total || 0),
            unreadMessages: 5, // Mock value
            isAvailable: astrologer.isAvailable
        };

        res.json(stats);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update astrologer availability slots
// @route   POST /api/astrologers/availability/slots
// @access  Private/Astrologer
const updateAvailabilitySlots = async (req, res) => {
    try {
        const { date, slots } = req.body;
        const astrologer = await Astrologer.findOne({ user: req.user._id });

        if (!astrologer) {
            return res.status(404).json({ message: 'Astrologer profile not found' });
        }

        // Clean up date to start of day for consistency
        const targetDate = new Date(date);
        targetDate.setHours(0, 0, 0, 0);

        // Remove existing slots for this date
        astrologer.availabilitySlots = astrologer.availabilitySlots.filter(
            slot => new Date(slot.date).setHours(0, 0, 0, 0) !== targetDate.getTime()
        );

        // Add new slots
        const newSlots = slots.map(slot => ({
            date: targetDate,
            startTime: slot.startTime,
            endTime: slot.endTime,
            isBooked: false
        }));

        astrologer.availabilitySlots.push(...newSlots);
        await astrologer.save();

        res.json(astrologer.availabilitySlots.filter(
            slot => new Date(slot.date).setHours(0, 0, 0, 0) === targetDate.getTime()
        ));
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get astrologer earnings stats
// @route   GET /api/astrologers/earnings
// @access  Private/Astrologer
const getAstrologerEarnings = async (req, res) => {
    try {
        const astrologer = await Astrologer.findOne({ user: req.user._id });

        if (!astrologer) {
            return res.status(404).json({ message: 'Astrologer profile not found' });
        }

        const now = new Date();
        const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        const totalEarnings = await Booking.aggregate([
            { $match: { astrologer: astrologer._id, status: 'completed' } },
            { $group: { _id: null, total: { $sum: '$price' } } }
        ]).then(res => res[0]?.total || 0);

        const monthlyEarnings = await Booking.aggregate([
            {
                $match: {
                    astrologer: astrologer._id,
                    status: 'completed',
                    startTime: { $gte: firstDayOfMonth }
                }
            },
            { $group: { _id: null, total: { $sum: '$price' } } }
        ]).then(res => res[0]?.total || 0);

        const sessionsCompleted = await Booking.countDocuments({
            astrologer: astrologer._id,
            status: 'completed'
        });

        // Mock pending payout as 15% of total for demonstration
        const pendingPayout = totalEarnings > 0 ? totalEarnings * 0.15 : 0;

        res.json({
            totalEarnings,
            monthlyEarnings,
            pendingPayout,
            sessionsCompleted
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get logged-in astrologer's own profile
// @route   GET /api/astrologers/me
// @access  Private/Astrologer
const getMyProfile = async (req, res) => {
    try {
        const astrologer = await Astrologer.findOne({ user: req.user._id }).populate('user', 'name email');
        if (!astrologer) {
            return res.status(404).json({ message: 'Astrologer profile not found' });
        }
        res.json(astrologer);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update astrologer profile
// @route   PUT /api/astrologers/profile
// @access  Private/Astrologer
const updateAstrologerProfile = async (req, res) => {
    try {
        const astrologer = await Astrologer.findOne({ user: req.user._id });

        if (!astrologer) {
            return res.status(404).json({ message: 'Astrologer profile not found' });
        }

        const { title, bio, specializations, experience, pricePerMinute, languages, avatar } = req.body;

        if (title !== undefined) astrologer.title = title;
        if (bio !== undefined) astrologer.bio = bio;
        if (specializations !== undefined) astrologer.specializations = specializations;
        if (experience !== undefined) astrologer.experience = experience;
        if (pricePerMinute !== undefined) astrologer.pricePerMinute = pricePerMinute;
        if (languages !== undefined) astrologer.languages = languages;
        if (avatar !== undefined) astrologer.avatar = avatar;

        const updated = await astrologer.save();
        const populated = await updated.populate('user', 'name email');

        res.json(populated);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAllAstrologers,
    getAstrologerById,
    updateAvailability,
    getAstrologerDashboard,
    updateAvailabilitySlots,
    getAstrologerEarnings,
    getMyProfile,
    updateAstrologerProfile
};
