// clients/restCountryClient.js
const axios = require('axios');
const URL = 'https://restcountries.com/v3.1/name/';

class RestCountryClientClass {
    constructor() {
        this.baseUrl = URL;
        this.axios = axios.create({
            timeout: 5000 // 5 seconds timeout
        });
    }

    async getCountryByName(name) {
        try {
            const response = await this.axios.get(`${this.baseUrl}${name}`);
            
            if (response.data.status === 404) {
                throw new Error('Country not found');
            }
            
            return response.data;
        } catch (error) {
            if (error.response && error.response.status === 404) {
                throw new Error('Country not found');
            }
            console.error('Client error fetching country data:', error.message);
            throw new Error('Failed to fetch country data');
        }
    }
}

module.exports = new RestCountryClientClass();