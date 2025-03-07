const express = require('express');
const router = express.Router();
const UserDao = require('../daos/userDao');
const bcryptUtils = require('../utils/bcryptUtils');

router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcryptUtils.hashPassword(password);

  UserDao.createUser(username, hashedPassword, (err) => {
    if (err) {
      return res.status(400).json({ error: 'Username already exists' });
    }
    res.status(201).json({ message: 'User registered successfully' });
  });
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  UserDao.findUserByUsername(username, async (err, user) => {
    if (err || !user) {
      return res.status(400).json({ error: 'Invalid username or password' });
    }

    const isValidPassword = await bcryptUtils.comparePassword(password, user.password);
    if (!isValidPassword) {
      return res.status(400).json({ error: 'Invalid username or password' });
    }

    res.status(200).json({ message: 'Login successful' });
  });
});

module.exports = router;