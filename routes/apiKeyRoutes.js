const express = require('express');
const router = express.Router();
const ApiKeyService = require('../services/apiKeyServices');
// const authMiddleware = require('../middleware/authMiddleware');

const apiKeyService = new ApiKeyService();

// Middleware to ensure user is authenticated
// router.use(authMiddleware);

// Generate new API key
router.post('/', async (req, res) => {
    try {
        const { userId, expiresInDays } = req.body;
        // const userId = req.user.id; // Get userId from authenticated user
        
        // Generate API key with default 30-day expiration if not specified
        const result = await apiKeyService.generateApiKey(
            userId, 
            expiresInDays || 30
        );
        
        res.status(201).json(result);
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// router.get('/header', async (req, res) => {
//     try{
//         const key = req.header('Authorization');
//         console.log(key);
//         res.status(200).json(key);

//     }catch(error){
//         res.status(500).json('Not Found');

//     }
// });

// Get all API keys for current user
router.get('/', async (req, res) => {
    try {
        const {userId} = req.query;
        console.log('userId:', userId); 
        const result = await apiKeyService.getUserApiKeys(userId);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

//GET specific API key
router.get('/:apiId', async (req, res) => {
    try {
        const { apiId } = req.params;
        const result = await apiKeyService.getApiKeyById(apiId);
        
        if (!result.success) {
            return res.status(404).json(result);
        }
        
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

//Update API Key
router.put('/:apiId', async (req, res) => {
    try {
        const { apiId } = req.params;
        const updates = req.body;
        
        // Validate updates object contains allowed fields
        const allowedUpdates = ['expiresAt', 'isActive', 'attempts'];
        const isValidUpdate = Object.keys(updates).every(key => allowedUpdates.includes(key));
        
        if (!isValidUpdate) {
            return res.status(400).json({ 
                success: false, 
                error: 'Invalid updates! Only expiresAt, isActive, and attempts can be updated.' 
            });
        }
        
        const result = await apiKeyService.updateApiKey(apiId, updates);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

//Revoke API key
router.patch('/:apiId/revoke', async (req, res) => {
    try {
        const { apiId } = req.params;
        const result = await apiKeyService.revokeApiKey(apiId);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

//Reset API Key attempts
router.patch('/:apiId/reset-attempts', async (req, res) => {
    try {
        const { apiId } = req.params;
        const result = await apiKeyService.resetAttempts(apiId);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

//Delete API key
router.delete('/:apiId', async (req, res) => {
    try {
        const { apiId } = req.params;
        const result = await apiKeyService.deleteApiKey(apiId);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;