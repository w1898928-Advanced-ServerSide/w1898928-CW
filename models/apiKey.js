class ApiKey {
  constructor(userId, apiId, apiKey) {
    this.userId = userId;
    this.apiId = apiId;
    this.apiKey = apiKey;
    this.expiresAt = expiresAt instanceof Date ? expiresAt : (expiresAt ? new Date(expiresAt) : null);
    this.attempts = 0;
    this.isActive = true;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }
}

module.exports = ApiKey;