const express = require('express');
const authRoutes = require('./routes/authRoutes');
const apiKeyRoutes = require('./routes/apiKeyRoutes');
const db = require('./config/db');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use('/auth', authRoutes);
app.use('/apiKey', apiKeyRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});