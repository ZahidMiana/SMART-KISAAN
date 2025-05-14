const express = require('express');
const router = express.Router();
const MarketController = require('../controllers/MarketController');

router.get('/market-prices', MarketController.getMarketPrices);

module.exports = router;