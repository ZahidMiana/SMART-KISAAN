const nodemailer = require('nodemailer');
const Subscriber = require('../models/Subscriber');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: 'smartkisaan818@gmail.com', pass: 'getkcrnxogfrzhnt' },
});

transporter.verify((error, success) => {
    if (error) console.error('Transporter verification failed:', error.message);
    else console.log('Transporter is ready to send emails');
});

const NewsletterController = {
    subscribe: async (req, res) => {
        try {
            console.log('User wants to subscribe to newsletter:', { email: req.body.email });
            const { email } = req.body;

            if (!email) return res.status(400).json({ error: 'Email is required' });

            const newSubscriber = new Subscriber({ email });
            await newSubscriber.save();
            console.log('System confirms newsletter subscription');
            console.log('User saved to database:', { email });

            const mailOptions = {
                from: 'smartkisaan818@gmail.com',
                to: email,
                subject: 'Smart Kisaan Newsletter Subscription',
                text: `Hi,\n\nThank you for subscribing to the Smart Kisaan Newsletter!\n\nBest,\nSmart Kisaan Team`,
            };

            await transporter.sendMail(mailOptions);
            console.log('Email sent to:', email);

            res.status(200).json({ message: 'Successfully subscribed to the newsletter' });
        } catch (error) {
            console.error('Error in newsletter subscription:', error.message);
            res.status(500).json({ error: 'Failed to subscribe to newsletter' });
        }
    },
};

module.exports = NewsletterController;