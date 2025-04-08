const ApiKeyDAO = require('../daos/apiKeyDao');
const crypto = require('crypto');

class ApiKeyService {
    constructor() {
        this.apiKeyDao = new ApiKeyDAO();
    }

    async generateApiKey(userId, expiresInDays = 30) {
        const apiKey = crypto.randomBytes(32).toString('hex');
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + expiresInDays);
        
        return await this.apiKeyDao.createApiKey(apiKey, userId, expiresAt.toISOString());
    }

    async getApiKeyById(apiId) {
        try {
            return await this.apiKeyDao.getApiKeyById(apiId);
        } catch (error) {
            throw error;
        }
    }

    async getApiKeyByKey(apiKey) {
        try {
            return await this.apiKeyDao.getApiKeyByKey(apiKey);
        } catch (error) {
            throw error;
        }
    }

    async getUserApiKeys(userId) {
        try {
            return await this.apiKeyDao.getApiKeysByUser(userId);
        } catch (error) {
            throw error;
        }
    }

    async updateApiKey(apiId, updates) {
        try {
            return await this.apiKeyDao.updateApiKey(apiId, updates);
        } catch (error) {
            throw error;
        }
    }

    async deleteApiKey(apiId) {
        try {
            return await this.apiKeyDao.deleteApiKey(apiId);
        } catch (error) {
            throw error;
        }
    }

    async revokeApiKey(apiId) {
        try {
            return await this.apiKeyDao.revokeApiKey(apiId);
        } catch (error) {
            throw error;
        }
    }

    async validateApiKey(apiKey) {
        try {
            const result = await this.apiKeyDao.getApiKeyByKey(apiKey);
            if (!result.success || !result.data) {
                return false;
            }

            const apiKeyData = result.data;
            
            // Check if API key is active
            if (!apiKeyData.isActive) {
                return false;
            }

            // Check if API key has expired
            if (apiKeyData.expiresAt && new Date(apiKeyData.expiresAt) < new Date()) {
                return false;
            }

            return true;
        } catch (error) {
            return false;
        }
    }

    async incrementAttempts(apiId) {
        try {
            return await this.apiKeyDao.incrementAttempts(apiId);
        } catch (error) {
            throw error;
        }
    }

    async resetAttempts(apiId) {
        try {
            return await this.apiKeyDao.resetAttempts(apiId);
        } catch (error) {
            throw error;
        }
    }
}

module.exports = ApiKeyService;