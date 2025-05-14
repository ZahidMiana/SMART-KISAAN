const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const User = require('../models/User');

require('dotenv').config();
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'smartkisaan818@gmail.com',
        pass: 'getkcrnxogfrzhnt', // Replace with your app password
    },
});

transporter.verify((error, success) => {
    if (error) console.error('Transporter verification failed:', error.message);
    else console.log('Transporter is ready to send emails');
});

const AuthController = {
    signup: async (req, res) => {
        try {
            console.log('User wants to register:', { name: req.body.name, email: req.body.email });
            const errors = validationResult(req);
            if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

            const { name, email, password } = req.body;
            const existingUser = await User.findOne({ email });
            if (existingUser) return res.status(400).json({ error: 'Email already exists' });

            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);

            const newUser = new User({ name, email, password: hashedPassword });
            await newUser.save();
            console.log('System confirms registration');
            console.log('User saved to database:', { name, email });

            const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: '1h' });

            const mailOptions = {
                from: 'smartkisaan818@gmail.com',
                to: email,
                subject: 'Welcome to Smart Kisaan - Registration Successful',
                text: `Hi ${name},\n\nThank you for registering with Smart Kisaan! Your account has been created successfully.\n\nEmail: ${email}\n\nBest,\nSmart Kisaan Team`,
            };

            await transporter.sendMail(mailOptions);
            console.log('Email sent to:', email);

            res.status(201).json({ message: 'User registered successfully', token });
        } catch (error) {
            console.error('Error during signup:', error.message);
            res.status(500).json({ error: 'Failed to register user', details: error.message });
        }
    },

    login: async (req, res) => {
        try {
            console.log('User wants to login:', { email: req.body.email });
            const { email, password } = req.body;
            const user = await User.findOne({ email });
            if (!user) return res.status(401).json({ error: 'Invalid email or password' });

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) return res.status(401).json({ error: 'Invalid email or password' });

            const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: '1h' });

            const mailOptions = {
                from: 'smartkisaan818@gmail.com',
                to: email,
                subject: 'Login to Smart Kisaan - Successful',
                text: `Hi ${user.name},\n\nYou have successfully logged into Smart Kisaan.\n\nEmail: ${email}\n\nBest,\nSmart Kisaan Team`,
            };

            await transporter.sendMail(mailOptions);
            console.log('Email sent to:', email);

            res.json({ message: 'Login successful', token, user: { name: user.name, email: user.email } });
        } catch (error) {
            console.error('Error during login:', error.message);
            res.status(500).json({ error: 'Failed to login' });
        }
    },
};

module.exports = AuthController;