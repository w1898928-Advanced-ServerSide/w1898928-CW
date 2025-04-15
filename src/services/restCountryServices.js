const RestCountryClient = require('../Client/restCountry');

class CountryService {
    constructor() {
        this.restCountryClient = RestCountryClient;
    }

    async getCountryByName(name) {
        try {
            const countryData = await this.restCountryClient.getCountryByName(name);
            
            return {
                success: true,
                data: countryData,
                message: 'Country data retrieved successfully'
            };
        } catch (error) {
            console.error('Service error:', error.message);
            return {
                success: false,
                error: error.message,
                message: 'Failed to retrieve country data'
            };
        }
    }

    async getCountryCurrency(name) {
        try {
            const countryData = await this.getCountryByName(name);
            if (!countryData.success) {
                return countryData; 
            }

            const currencies = countryData.data[0]?.currencies;
            return {
                success: true,
                data: currencies,
                message: 'Country currencies retrieved successfully'
            };
        } catch (error) {
            console.error('Service error:', error.message);
            return {
                success: false,
                error: error.message,
                message: 'Failed to retrieve country currencies'
            };
        }
    }
}

module.exports = new CountryService();