const db = require("../config/db");
const { createResponse } = require('../utils/responseUtil');

class ApiKeyDAO {
    constructor() {}

    async createApiKey(apiKey, userId, expiresAt) {
        return new Promise((resolve, reject) => {
            const sql = `INSERT INTO api_keys (apiKey, userId, expiresAt) 
                         VALUES (?, ?, ?)`;
            db.run(sql, [apiKey, userId, expiresAt], function(err) {
                if (err) return reject(err);
                resolve(createResponse(true, { 
                    apiId: this.lastID, 
                    apiKey, 
                    userId, 
                    expiresAt,
                    isActive: true,
                    attempts: 0,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                }));
            });
        });
    }

    async getApiKeyById(apiId) {
        return new Promise((resolve, reject) => {
            const sql = `SELECT * FROM api_keys WHERE apiId = ?`;
            db.get(sql, [apiId], (err, row) => {
                if (err) return reject(err);
                if (!row) {
                // If no API key found, return a message
                resolve(createResponse(false, null, 'API key not found'));
            } else {
                resolve(createResponse(true, row));
            }
            });
        });
    }

    async getApiKeyByKey(apiKey) {
        return new Promise((resolve, reject) => {
            const sql = `SELECT * FROM api_keys WHERE apiKey = ?`;
            db.get(sql, [apiKey], (err, row) => {
                if (err) return reject(err);
                resolve(createResponse(true, row));
            });
        });
    }

    async getApiKeysByUser(userId) {
        return new Promise((resolve, reject) => {
            const sql = `SELECT * FROM api_keys WHERE userId = ?`;
            db.all(sql, [userId], (err, rows) => {
                if (err) return reject(err);
                resolve(createResponse(true, rows));
            });
        });
    }

    async updateApiKey(apiId, updates) {
        return new Promise((resolve, reject) => {
            const { expiresAt, isActive, attempts } = updates;
            const sql = `UPDATE api_keys 
                         SET expiresAt = ?, 
                             isActive = ?, 
                             attempts = ?,
                             updatedAt = datetime('now') 
                         WHERE apiId = ?`;
            db.run(sql, [expiresAt, isActive, attempts, apiId], function(err) {
                if (err) return reject(err);
                 const responseBody = {
                apiId,
                expiresAt,
                isActive,
                attempts,
                updatedAt: new Date().toISOString()
            };
            
            resolve(createResponse(true, responseBody, 'API Key updated'));
            });
        });
    }

    async incrementAttempts(apiId) {
        return new Promise((resolve, reject) => {
            const sql = `UPDATE api_keys 
                         SET attempts = attempts + 1,
                             updatedAt = datetime('now')
                         WHERE apiId = ?`;
            db.run(sql, [apiId], function(err) {
                if (err) return reject(err);
                resolve(createResponse(true, null, 'API Key attempts incremented'));
            });
        });
    }

    async deleteApiKey(apiId) {
        return new Promise((resolve, reject) => {
            const sql = `DELETE FROM api_keys WHERE apiId = ?`;
            db.run(sql, [apiId], function(err) {
                if (err) return reject(err);
                resolve(createResponse(true, null, 'API Key deleted'));
            });
        });
    }

    async revokeApiKey(apiId) {
        return this.updateApiKey(apiId, { isActive: false });
    }

    async resetAttempts(apiId) {
        return this.updateApiKey(apiId, { attempts: 0 });
    }
}

module.exports = ApiKeyDAO;