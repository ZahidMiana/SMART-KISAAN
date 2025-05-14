const express = require('express');
const router = express.Router();

const AuthController = require('../controllers/AuthController');
const CommunityController = require('../controllers/CommunityController');
const NewsletterController = require('../controllers/NewsletterController');
const MarketController = require('../controllers/MarketController');

router.post('/api/auth/signup', AuthController.signup);
router.post('/api/auth/login', AuthController.login);
router.post('/api/community/join', CommunityController.joinCommunity);
router.post('/api/newsletter/subscribe', NewsletterController.subscribe);
router.get('/api/market-prices', MarketController.getMarketPrices);

module.exports = router;