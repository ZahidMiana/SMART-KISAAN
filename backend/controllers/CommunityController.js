const nodemailer = require('nodemailer');
const CommunityMember = require('../models/CommunityMember');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: 'smartkisaan818@gmail.com', pass: 'getkcrnxogfrzhnt' },
});

transporter.verify((error, success) => {
    if (error) console.error('Transporter verification failed:', error.message);
    else console.log('Transporter is ready to send emails');
});

const CommunityController = {
    joinCommunity: async (req, res) => {
        try {
            console.log('User wants to join community:', { name: req.body.name, email: req.body.email });
            const { name, email } = req.body;

            if (!name || !email) return res.status(400).json({ error: 'Name and email are required' });

            const newMember = new CommunityMember({ name, email });
            await newMember.save();
            console.log('System confirms community join');
            console.log('User saved to database:', { name, email });

            const mailOptions = {
                from: 'smartkisaan818@gmail.com',
                to: email,
                subject: 'Welcome to the Smart Kisaan Community!',
                text: `Hi ${name},\n\nThank you for joining the Smart Kisaan community!\n\nBest,\nSmart Kisaan Team`,
            };

            await transporter.sendMail(mailOptions);
            console.log('Email sent to:', email);

            res.status(200).json({ message: 'Successfully joined the community' });
        } catch (error) {
            console.error('Error in joinCommunity:', error.message);
            res.status(500).json({ error: 'Failed to join community' });
        }
    },
};

module.exports = CommunityController;