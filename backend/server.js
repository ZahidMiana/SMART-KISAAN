const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const routes = require('./routes');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/', routes);

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/smartkisaan', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected successfully'))
.catch(err => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
});

// Set cookie for new visitors
app.use((req, res, next) => {
    if (!req.cookies.visitorId) {
        const visitorId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        res.cookie('visitorId', visitorId, { maxAge: 900000, httpOnly: true }); // 15-minute expiration
        console.log('New visitor cookie set:', visitorId);
    }
    next();
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});