const express = require('express');
const session = require('express-session');
const authRoutes = require('./src/routes/authRoutes');
const apiKeyRoutes = require('./src/routes/apiKeyRoutes');
const countryRoutes = require('./src/routes/restCountryRoutes');
const db = require('./src/config/db');
const cors = require('cors'); // Add this line
const loggerMiddleware = require('./src/middleware/logger');
const errorHandler = require('./src/middleware/errorHandler');

const app = express();
// Enable CORS for all routes
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
const PORT = process.env.PORT || 4000;
app.use(session({
  secret: "asdfghjkl0987654321",
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000
  }
}));
app.use(loggerMiddleware)

app.use(express.json());
app.use('/auth', authRoutes);
app.use('/apiKey', apiKeyRoutes);
app.use('/api/countries', countryRoutes);
app.use(errorHandler)
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});