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

// Get all API keys for current user
router.get('/', async (req, res) => {
    try {
        const {userId} = req.query
        console.log('userId:', userId); 
        const result = await apiKeyService.getUserApiKeys(userId);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get specific API key
router.get('/:apiId', async (req, res) => {
    try {
        const { apiId } = req.params;
        
        const result = await apiKeyService.getApiKeyById(apiId);
        
        // Ensure the API key belongs to the requesting user
        // if (result.data && result.data.userId !== req.user.id) {
        //     return res.status(403).json({ success: false, error: 'Unauthorized' });
        // }
        
        res.status(200).json(result);
    } catch (error) {
        res.status(404).json({ success: false, error: error.message });
    }
});

// Update API key
router.put('/:apiId', async (req, res) => {
    try {
        const { apiId } = req.query;
        const { expiresAt, isActive } = req.body;
        
        // First get the key to verify ownership
        const keyResult = await apiKeyService.getApiKeyById(apiId);
        // if (!keyResult.success || keyResult.data.userId !== req.user.id) {
        //     return res.status(403).json({ success: false, error: 'Unauthorized' });
        // }
        
        const result = await apiKeyService.updateApiKey(apiId, { 
            expiresAt, 
            isActive 
        });
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// Revoke API key
router.post('/:apiId/revoke', async (req, res) => {
    try {
        const { apiId } = req.query;
        
        // First get the key to verify ownership
        const keyResult = await apiKeyService.getApiKeyById(apiId);
        // if (!keyResult.success || keyResult.data.userId !== req.user.id) {
        //     return res.status(403).json({ success: false, error: 'Unauthorized' });
        // }
        
        const result = await apiKeyService.revokeApiKey(apiId);
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// Reset attempts counter
router.post('/:apiId/reset-attempts', async (req, res) => {
    try {
        const { apiId } = req.query;
        
        // First get the key to verify ownership
        const keyResult = await apiKeyService.getApiKeyById(apiId);
        // if (!keyResult.success || keyResult.data.userId !== req.user.id) {
        //     return res.status(403).json({ success: false, error: 'Unauthorized' });
        // }
        
        const result = await apiKeyService.resetAttempts(apiId);
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// Delete API key
router.delete('/:apiId', async (req, res) => {
    try {
        const { apiId } = req.query;
        
        // First get the key to verify ownership
        const keyResult = await apiKeyService.getApiKeyById(apiId);
        // if (!keyResult.success || keyResult.data.userId !== req.user.id) {
        //     return res.status(403).json({ success: false, error: 'Unauthorized' });
        // }
        
        const result = await apiKeyService.deleteApiKey(apiId);
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

module.exports = router;