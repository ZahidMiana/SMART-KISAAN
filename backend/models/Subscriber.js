const mongoose = require('mongoose');

const subscriberSchema = new mongoose.Schema({
    email: String,
    subscribedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Subscriber', subscriberSchema);