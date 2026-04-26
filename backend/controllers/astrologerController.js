const Astrologer = require('../models/Astrologer'); // Keep for legacy if needed
const AstrologerProfile = require('../models/AstrologerProfile');
const Booking = require('../models/Booking');
const User = require('../models/User');

// @desc    Complete astrologer onboarding
// @route   POST /api/astrologer/onboarding
// @access  Private
const completeOnboarding = async (req, res) => {
    try {
        const { specialization, experience, languages, pricePerMin, bio, profilePhoto } = req.body;
        
        let profile = await AstrologerProfile.findOne({ userId: req.user._id });
        
        if (!profile) {
            profile = new AstrologerProfile({ userId: req.user._id });
        }

        profile.specialization = specialization;
        profile.experience = experience;
        profile.languages = languages;
        profile.pricePerMin = pricePerMin;
        profile.bio = bio;
        profile.profilePhoto = profilePhoto;
        profile.status = 'pending';

        await profile.save();
        res.json({ message: 'Profile submitted for review' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get logged-in astrologer's profile
// @route   GET /api/astrologer/profile
// @access  Private
const getMyProfile = async (req, res) => {
    try {
        const profile = await AstrologerProfile.findOne({ userId: req.user._id }).populate('userId', 'name email');
        if (!profile) {
            return res.status(404).json({ message: 'Profile not found' });
        }
        res.json(profile);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Set astrologer online status
// @route   PATCH /api/astrologer/go-online
// @access  Private
const goOnline = async (req, res) => {
    try {
        const profile = await AstrologerProfile.findOneAndUpdate(
            { userId: req.user._id },
            { isOnline: true },
            { new: true }
        );
        res.json(profile);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Set astrologer offline status
// @route   PATCH /api/astrologer/go-offline
// @access  Private
const goOffline = async (req, res) => {
    try {
        const profile = await AstrologerProfile.findOneAndUpdate(
            { userId: req.user._id },
            { isOnline: false },
            { new: true }
        );
        res.json(profile);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get list of approved and online astrologers
// @route   GET /api/astrologers/list
// @access  Public
const getApprovedAstrologers = async (req, res) => {
    try {
        const astrologers = await AstrologerProfile.find({ status: 'approved' })
            .populate('userId', 'name email')
            .select('userId specialization experience languages pricePerMin bio profilePhoto status isOnline totalRatings averageRating');
        
        const formatted = astrologers.map(a => ({
            _id: a._id,
            name: a.userId.name,
            photo: a.profilePhoto,
            specialization: a.specialization,
            pricePerMin: a.pricePerMin,
            averageRating: a.averageRating,
            isOnline: a.isOnline
        }));

        res.json(formatted);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ... existing legacy handlers can stay or be replaced ...
const getAllAstrologers = async (req, res) => {
    // Legacy support
    try {
        const astrologers = await AstrologerProfile.find({ status: 'approved' }).populate('userId', 'name email');
        res.json(astrologers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getAstrologerById = async (req, res) => {
    try {
        const astrologer = await AstrologerProfile.findById(req.params.id).populate('userId', 'name email');
        if (astrologer) res.json(astrologer);
        else res.status(404).json({ message: 'Astrologer not found' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getAstrologerDashboard = async (req, res) => {
    try {
        const profile = await AstrologerProfile.findOne({ userId: req.user._id });
        if (!profile) return res.status(404).json({ message: 'Profile not found' });

        const stats = {
            totalEarnings: profile.totalEarnings,
            averageRating: profile.averageRating,
            isOnline: profile.isOnline,
            totalRatings: profile.totalRatings
        };
        res.json(stats);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateAvailability = async (req, res) => {
    try {
        const profile = await AstrologerProfile.findOne({ userId: req.user._id });
        if (profile) {
            profile.isOnline = req.body.isAvailable !== undefined ? req.body.isAvailable : profile.isOnline;
            await profile.save();
            res.json(profile);
        } else {
            res.status(404).json({ message: 'Profile not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateAvailabilitySlots = async (req, res) => {
    // Simplified placeholder for legacy slot update
    res.status(501).json({ message: 'Slot management is being updated' });
};

const getAstrologerEarnings = async (req, res) => {
    try {
        const profile = await AstrologerProfile.findOne({ userId: req.user._id });
        if (!profile) return res.status(404).json({ message: 'Profile not found' });
        res.json({ totalEarnings: profile.totalEarnings });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateAstrologerProfile = async (req, res) => {
    try {
        const profile = await AstrologerProfile.findOne({ userId: req.user._id });
        if (!profile) return res.status(404).json({ message: 'Profile not found' });

        const { specialization, experience, pricePerMin, bio, languages } = req.body;
        if (specialization) profile.specialization = specialization;
        if (experience) profile.experience = experience;
        if (pricePerMin) profile.pricePerMin = pricePerMin;
        if (bio) profile.bio = bio;
        if (languages) profile.languages = languages;

        await profile.save();
        res.json(profile);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getChatRequests = async (req, res) => {
    try {
        const profile = await AstrologerProfile.findOne({ userId: req.user._id });
        if (!profile) return res.status(404).json({ message: 'Profile not found' });

        const requests = await Booking.find({ 
            astrologer: profile._id, 
            status: 'pending' 
        }).populate('user', 'name');
        res.json(requests);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const acceptChatRequest = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) return res.status(404).json({ message: 'Request not found' });
        
        booking.status = 'accepted';
        await booking.save();
        
        // Notify user via socket or push notification could go here
        
        res.json(booking);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const rejectChatRequest = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) return res.status(404).json({ message: 'Request not found' });
        
        booking.status = 'rejected';
        await booking.save();
        
        res.json({ message: 'Request rejected' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    completeOnboarding,
    getMyProfile,
    goOnline,
    goOffline,
    getApprovedAstrologers,
    getAllAstrologers,
    getAstrologerById,
    getAstrologerDashboard,
    updateAvailability,
    updateAvailabilitySlots,
    getAstrologerEarnings,
    updateAstrologerProfile,
    getChatRequests,
    acceptChatRequest,
    rejectChatRequest
};



