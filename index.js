const express = require('express');
const authRoutes = require('./routes/authRoutes');
const apiKeyRoutes = require('./routes/apiKeyRoutes');
const countryRoutes = require('./routes/restCountryRoutes');
const db = require('./config/db');
const cors = require('cors'); // Add this line

const app = express();
// Enable CORS for all routes
app.use(cors({
  origin: 'http://localhost:3001', // Your frontend URL
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