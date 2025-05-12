const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Rest Country API',
    description: 'API documentation for the Rest Country Backend'
  },
  host: 'localhost:3000', // Update to your production host if deployed
  schemes: ['http'],      // Or ['https'] in production
  
};

const outputFile = './swagger-output.json';
const endpointsFiles = ['./index.js']; // or your main entry file

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
  console.log('Swagger documentation generated successfully.');
});