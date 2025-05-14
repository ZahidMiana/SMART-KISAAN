const fs = require('fs').promises;
const path = require('path');

const cropDataFile = path.join(__dirname, '..', 'data', 'crop.json');
const livestockDataFile = path.join(__dirname, '..', 'data', 'livestock.json');
let cropData = [];
let livestockData = [];

async function loadMarketData() {
    try {
        const [cropRaw, livestockRaw] = await Promise.all([
            fs.readFile(cropDataFile, 'utf8'),
            fs.readFile(livestockDataFile, 'utf8')
        ]);
        cropData = JSON.parse(cropRaw);
        livestockData = JSON.parse(livestockRaw);
        console.log('Market data loaded successfully:', { cropCount: cropData.length, livestockCount: livestockData.length });
    } catch (error) {
        console.error('Error loading market data files:', error.message);
        // Log error but don't exit to keep server running
    }
}

loadMarketData();

const MarketController = {
    getMarketPrices: async (req, res) => {
        const { type, page = 1, limit = 10 } = req.query;
        const data = type === 'livestock' ? livestockData : cropData;

        if (!data || data.length === 0) {
            return res.status(404).json({ error: 'No market data available' });
        }

        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const paginatedData = data.slice(startIndex, endIndex);

        const totalItems = data.length;
        const totalPages = Math.ceil(totalItems / limit);

        res.json({
            data: paginatedData,
            currentPage: parseInt(page),
            totalPages,
            totalItems,
            currency: 'PKR',
        });
    },
};

setInterval(() => loadMarketData(), 10000);

module.exports = MarketController;