const express = require('express');
const router = express.Router();
const ApiKeyService = require('../services/apiKeyServices');
const checkSession = require('../middleware/sessionAuth');
const CustomError = require('../utils/customError');

const apiKeyService = new ApiKeyService();

//Generate new API key
router.post('/', checkSession, async (req, res, next) => {
    try {
        const { userId, expiresInDays } = req.body;
        const result = await apiKeyService.generateApiKey(userId, expiresInDays || 30);
        res.status(201).json(result);
    } catch (err) {
        next(new CustomError('Failed to generate API key', 500, err));
    }
});

//Get all API keys for a user
router.get('/', checkSession, async (req, res, next) => {
    try {
        const { userId } = req.query;
        const result = await apiKeyService.getUserApiKeys(userId);
        res.status(200).json(result);
    } catch (err) {
        next(new CustomError('Failed to fetch API keys', 500, err));
    }
});

//Get specific API key by ID
router.get('/:apiId', checkSession, async (req, res, next) => {
    try {
        const { apiId } = req.params;
        const result = await apiKeyService.getApiKeyById(apiId);

        if (!result.success) {
            throw new CustomError('API key not found', 404);
        }

        res.status(200).json(result);
    } catch (err) {
        next(err instanceof CustomError ? err : new CustomError('Failed to get API key', 500, err));
    }
});

//Update API key
router.put('/:apiId', checkSession, async (req, res, next) => {
    try {
        const { apiId } = req.params;
        const updates = req.body;

        const allowedUpdates = ['expiresAt', 'isActive', 'attempts'];
        const isValidUpdate = Object.keys(updates).every(key => allowedUpdates.includes(key));

        if (!isValidUpdate) {
            throw new CustomError('Invalid updates! Only expiresAt, isActive, and attempts can be updated.', 400);
        }

        const result = await apiKeyService.updateApiKey(apiId, updates);
        res.status(200).json(result);
    } catch (err) {
        next(new CustomError('Failed to update API key', 500, err));
    }
});

//Revoke API key
router.patch('/:apiId/revoke', checkSession, async (req, res, next) => {
    try {
        const { apiId } = req.params;
        const result = await apiKeyService.revokeApiKey(apiId);
        res.status(200).json(result);
    } catch (err) {
        next(new CustomError('Failed to revoke API key', 500, err));
    }
});

//Reset API key attempts
router.patch('/:apiId/reset-attempts', checkSession, async (req, res, next) => {
    try {
        const { apiId } = req.params;
        const result = await apiKeyService.resetAttempts(apiId);
        res.status(200).json(result);
    } catch (err) {
        next(new CustomError('Failed to reset attempts', 500, err));
    }
});

// Delete API key
router.delete('/:apiId', checkSession, async (req, res, next) => {
    try {
        const { apiId } = req.params;
        const result = await apiKeyService.deleteApiKey(apiId);
        res.status(200).json(result);
    } catch (err) {
        next(new CustomError('Failed to delete API key', 500, err));
    }
});

module.exports = router;
