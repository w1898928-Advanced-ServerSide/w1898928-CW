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
        console.log('Authenticated with API key:', req.apiKey.apiId);
        if (result.success) {
            res.status(200).json(result);
        } else {
            res.status(404).json(result);
        }
    } catch (error) {
        console.error('Route error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error',
            message: 'An unexpected error occurred'
        });
    }
});

// GET country currency by name
// router.get('/:name/currency', async (req, res) => {
//     try {
//         const { name } = req.params;
//         const result = await countryService.getCountryCurrency(name);
        
//         if (result.success) {
//             res.status(200).json(result);
//         } else {
//             res.status(404).json(result);
//         }
//     } catch (error) {
//         console.error('Route error:', error);
//         res.status(500).json({
//             success: false,
//             error: 'Internal server error',
//             message: 'An unexpected error occurred'
//         });
//     }
// });

// You can add more routes here as needed

module.exports = router;