const mongoose = require('mongoose');

const communityMemberSchema = new mongoose.Schema({
    name: String,
    email: String,
    joinedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('CommunityMember', communityMemberSchema);