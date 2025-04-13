const express = require('express');
const router = express.Router();
const bcryptUtils = require('../utils/bcryptUtils');
const UserService = require('../services/userService');

const userService = new UserService();

// Register user
router.post('/register', async (req, res) => {
    try {
        const { username, password, email} = req.body;
        await userService.registerUser(username, password, email);
        res.status(201).json({ success: true, message: 'User registered successfully' });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// Login user
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await userService.loginUser(username, password);
        res.status(200).json({ success: true, message: 'Login successful', user });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// Create user
router.post('/create', async (req, res) => {
    try {
        const { username, password, email } = req.body;
        await userService.createUser(username, password, email);
        res.status(201).json({ success: true, message: 'User created successfully' });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// Get all users
router.get('/users', async (req, res) => {
    try {
        const result = await userService.getAllUsers();
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get user by ID
router.get('/users/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await userService.getUserById(id);
        res.status(200).json(result);
    } catch (error) {
        res.status(404).json({ success: false, error: error.message });
    }
});

// Update user
router.put('/users/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { username, password, email } = req.body;
        const hashedPassword = await bcryptUtils.hashPassword(password);
        await userService.updateUser(id, username, hashedPassword, email);
        res.status(200).json({ success: true, message: 'User updated successfully' });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// Delete user
router.delete('/users/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await userService.deleteUser(id);
        res.status(200).json({ success: true, message: 'User deleted successfully' });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

module.exports = router;