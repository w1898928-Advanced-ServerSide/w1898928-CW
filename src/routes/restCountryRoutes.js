// routes/countryRoutes.js
const express = require('express');
const router = express.Router();
const countryService = require('../services/restCountryServices');
const apiKeyMiddleware = require('../middleware/authMiddleware');

// GET country by name
router.get('/:name', apiKeyMiddleware, async (req, res) => {
    try {
        const { name } = req.params;
        const result = await countryService.getCountryByName(name);
        
        if (!result.success) {
            return res.status(404).json(result);
        }

        // Transform the data to include only requested fields
        const filteredData = result.data.map(country => ({
            name: {
                common: country.name.common,
                official: country.name.official
            },
            capital: country.capital,
            languages: country.languages,
            flag: country.flag,
            flags: country.flags // Include both emoji flag and image URLs
        }));

        res.status(200).json({
            success: true,
            data: filteredData,
            message: 'Country data retrieved successfully'
        });

    } catch (error) {
        console.error('Route error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error',
            message: 'An unexpected error occurred'
        });
    }
});



module.exports = router;