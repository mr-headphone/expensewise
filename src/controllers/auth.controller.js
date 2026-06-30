// This file handles Register, Login, and Get Profile
import jwt from 'jsonwebtoken';
import { User } from '../models/user.model.js';

// Helper function to create a login token
const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// ── REGISTER ─────────────────────────────────────────────
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check all fields are provided
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and password.',
      });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered.',
      });
    }

    // Create the user
    const user = await User.create({ name, email, password });

    // Create a token
    const token = generateToken(user._id);

    // Send back the token and user info
    res.status(201).json({
      success: true,
      token,
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email 
      },
    });

  } catch (error) {
    console.error('Register error:', error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ── LOGIN ─────────────────────────────────────────────────
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check fields are provided
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password.',
      });
    }

    // Find user by email - include password for comparison
    const user = await User.findOne({ email }).select('+password');

    // Check if user exists AND password is correct
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({
        success: false,
        message: 'Incorrect email or password.',
      });
    }

    // Create a token
    const token = generateToken(user._id);

    // Send back the token and user info
    res.json({
      success: true,
      token,
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email 
      },
    });

  } catch (error) {
    console.error('Login error:', error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ── GET MY PROFILE ────────────────────────────────────────
export const getMe = async (req, res) => {
  try {
    const { _id: id, name, email, createdAt } = req.user;
    res.json({ 
      success: true, 
      user: { id, name, email, createdAt } 
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};