const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const router = express.Router();
require('dotenv').config();

// Register route
router.post('/register', async (req, res) => {
    console.log("Request body:", req.body);
    const { username, email, password } = req.body;

    // Validate inputs
    if (!username || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        // Check if the user already exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash the password before saving it
        const salt = await bcrypt.genSalt(10); // Generate salt
        const hashedPassword = await bcrypt.hash(password, salt); // Hash the password

        // Create a new user
        const newUser = await User.create({ username, email, password: hashedPassword });
        res.status(201).json({ message: "User created successfully", user: newUser });
    } catch (error) {
        return res.status(500).json({ message: "Error registering user" });
    }
});

// Login route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if user exists
        const user = await User.findOne({ where: { email } });
        if (!user) return res.status(400).json({ message: 'User not found' });

        // Check password
        const validPassword = await bcrypt.compare(password, user.password);
        console.log("Password valid:", validPassword); // Log the result of the password comparison
        if (!validPassword) return res.status(400).json({ message: 'Invalid password' });

        // Generate JWT token
        const token = jwt.sign({ id: user.id, role: user.role }, process.env.TOKEN_SECRET, { expiresIn: '1h' });

        res.status(200).json({ message: 'Logged in successfully', token });

        // Log only username and token
        console.log("Logged in user:", user.username);
        console.log("Generated token:", token);

    } catch (error) {
        console.error(error); // Log any error that occurs
        res.status(500).json({ message: 'Error logging in' });
    }
});

module.exports = router;
