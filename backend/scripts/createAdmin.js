const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

const path = require('path');
dotenv.config({ path: path.join(__dirname, '../.env') });


const createAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected...');

        const email = 'admin@astrotalk.com';
        const existingAdmin = await User.findOne({ email });

        if (existingAdmin) {
            console.log('Admin already exists!');
            process.exit();
        }

        const admin = await User.create({
            name: 'System Admin',
            email: email,
            password: 'adminpassword123', // User should change this
            role: 'admin',
            status: 'active'
        });

        console.log('Admin created successfully!');
        console.log('Email:', admin.email);
        console.log('Password: adminpassword123');
        process.exit();
    } catch (error) {
        console.error('Error creating admin:', error);
        process.exit(1);
    }
};

createAdmin();
