const ApiKeyService = require('../services/apiKeyServices');
const { createResponse } = require('../utils/responseUtil');

const apiKeyService = new ApiKeyService();

const apiKeyMiddleware = async (req, res, next) => {
    try {
        // Get API key from header
        const apiKey = req.header('Authorization') || req.header('x-api-key') || req.query.apiKey;
        
        if (!apiKey) {
            return res.status(401).json(createResponse(false, null, 'API key is required'));
        }

        // Validate API key format
        if (!/^[a-f0-9]{64}$/.test(apiKey)) {
            return res.status(400).json(createResponse(false, null, 'Invalid API key format'));
        }

        // Check API key in database
        const keyResult = await apiKeyService.getApiKeyByKey(apiKey);
        
        if (!keyResult.success || !keyResult.data) {
            return res.status(401).json(createResponse(false, null, 'Invalid API key'));
        }

        const apiKeyData = keyResult.data;

        // Check if API key is active
        if (!apiKeyData.isActive) {
            return res.status(403).json(createResponse(false, null, 'API key is revoked'));
        }

        // Check if API key is expired
        if (apiKeyData.expiresAt && new Date(apiKeyData.expiresAt) < new Date()) {
            return res.status(403).json(createResponse(false, null, 'API key has expired'));
        }

        // Implement basic rate limiting (optional)
        // You might want to move this to a separate rate limiting middleware
        const MAX_ATTEMPTS = 100;
        if (apiKeyData.attempts >= MAX_ATTEMPTS) {
            return res.status(429).json(createResponse(false, null, 'Too many requests'));
        }

        // Increment attempt counter
        await apiKeyService.incrementAttempts(apiKeyData.apiId);

        // Attach API key info to request for use in controllers
        req.apiKey = apiKeyData;

        next();
    } catch (error) {
        console.error('Authentication error:', error);
        return res.status(500).json(createResponse(false, null, 'Internal server error'));
    }
};

module.exports = apiKeyMiddleware;