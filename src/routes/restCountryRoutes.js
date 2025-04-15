const express = require('express');
const router = express.Router();
const countryService = require('../services/restCountryServices');
const apiKeyMiddleware = require('../middleware/authMiddleware');
const CustomError = require('../utils/customError');

//GET country by name
router.get('/:name', apiKeyMiddleware, async (req, res, next) => {
    try {
        const { name } = req.params;
        const result = await countryService.getCountryByName(name);

        if (!result.success || !result.data || result.data.length === 0) {
            throw new CustomError('Country not found', 404);
        }

        // Filter the response
        const filteredData = result.data.map(country => ({
            name: {
                common: country.name.common,
                official: country.name.official
            },
            capital: country.capital,
            languages: country.languages,
            flag: country.flag,
            flags: country.flags // emoji and image URL
        }));

        res.status(200).json({
            success: true,
            data: filteredData,
            message: 'Country data retrieved successfully'
        });

    } catch (err) {
        next(new CustomError('Failed to fetch country data', 500, err));
    }
});

module.exports = router;
