import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';  // Import User model
import { verifyToken } from '../middleware/auth.js';  // Import verifyToken middleware

const router = express.Router();

// Register a new user
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json('User already exists.');
    }

    // Hash the password before saving to the database
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user and save to the database
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });
    await newUser.save();

    res.status(201).json('User registered successfully.');
  } catch (err) {
    res.status(500).json(err.message);
  }
});

// Login and generate a JWT token
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json('User not found.');
    }

    // Compare the entered password with the hashed password in the database
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json('Invalid credentials.');
    }

    // Generate a JWT token for the user
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.status(200).json({ user, token });
  } catch (err) {
    res.status(500).json(err.message);
  }
});

// Get the authenticated user's details (protected route)
router.get('/me', verifyToken, async (req, res) => {
  try {
    // Fetch the user from the database using the user ID from the JWT token
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json('User not found.');
    }

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err.message);
  }
});

export default router;
