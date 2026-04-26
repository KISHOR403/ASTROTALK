const User = require('../models/User');
const AstrologerProfile = require('../models/AstrologerProfile');
const jwt = require('jsonwebtoken');
const { sendReviewEmail } = require('../utils/sendEmail');

// Generate JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

const registerUser = async (req, res) => {
    const { name, email, password, role } = req.body;

    try {
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const userStatus = role === 'astrologer' ? 'pending' : 'active';

        const user = await User.create({
            name,
            email,
            password,
            role: role || 'client',
            status: userStatus
        });

        if (user) {
            if (role === 'astrologer') {
                await AstrologerProfile.create({
                    userId: user._id,
                    status: 'pending'
                });
                // Send review email
                await sendReviewEmail(user.email, user.name);
            }

            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                status: user.status,
                token: generateToken(user._id),
                message: role === 'astrologer' ? 'Complete your onboarding' : undefined
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            if (user.role === 'astrologer') {
                if (user.status === 'pending') {
                    return res.status(403).json({ message: 'Your account is under review by admin' });
                }
                if (user.status === 'rejected') {
                    return res.status(403).json({ message: 'Your application was not approved. Contact support.' });
                }
            }

            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                status: user.status,
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const googleLogin = async (req, res) => {
    const { access_token, role } = req.body;

    try {
        const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
            headers: { Authorization: `Bearer ${access_token}` }
        });

        if (!response.ok) {
            return res.status(401).json({ message: 'Invalid Google token' });
        }

        const data = await response.json();
        const { email, name, sub } = data;

        let user = await User.findOne({ email });

        if (user) {
            // Update googleId if it was not set previously
            if (!user.googleId) {
                user.googleId = sub;
                await user.save();
            }
        } else {
            // Create new user
            user = await User.create({
                name,
                email,
                googleId: sub,
                role: role || 'client'
            });
        }

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id),
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { registerUser, loginUser, googleLogin };
