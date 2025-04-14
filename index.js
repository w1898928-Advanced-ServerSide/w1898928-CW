const express = require('express');
const authRoutes = require('./src/routes/authRoutes');
const apiKeyRoutes = require('./src/routes/apiKeyRoutes');
const countryRoutes = require('./src/routes/restCountryRoutes');
const db = require('./src/config/db');
const cors = require('cors'); 

const app = express();

app.use(cors({
  origin: 'http://localhost:3001',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use('/auth', authRoutes);
app.use('/apiKey', apiKeyRoutes);
app.use('/api/countries', countryRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});