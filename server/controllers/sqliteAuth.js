const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { dbOperations } = require('../database');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'your-secret-key', {
    expiresIn: process.env.JWT_EXPIRE || '30d'
  });
};

// Send Response Helper
const sendResponse = (res, statusCode, success, message, data = null) => {
  res.status(statusCode).json({
    success,
    message,
    data
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
  try {
    const { fullName, email, password, confirmPassword, role } = req.body;

    // Validation
    if (!fullName || !email || !password) {
      return sendResponse(res, 400, false, 'Please provide all required fields');
    }

    if (password !== confirmPassword) {
      return sendResponse(res, 400, false, 'Passwords do not match');
    }

    if (password.length < 6) {
      return sendResponse(res, 400, false, 'Password must be at least 6 characters long');
    }

    // Check if user already exists
    const existingUser = await dbOperations.getUserByEmail(email);
    if (existingUser) {
      return sendResponse(res, 400, false, 'User with this email already exists');
    }

    // Hash password
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const user = await dbOperations.createUser({
      full_name: fullName,
      email,
      password: hashedPassword,
      role: role || 'jobseeker'
    });

    // Generate token
    const token = generateToken(user.id);

    sendResponse(res, 201, true, 'User registered successfully', {
      user: {
        id: user.id,
        fullName: user.full_name,
        email: user.email,
        role: user.role
      },
      token
    });
  } catch (error) {
    console.error('Registration error:', error);
    sendResponse(res, 500, false, 'Server error during registration');
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return sendResponse(res, 400, false, 'Please provide email and password');
    }

    // Check if user exists
    const user = await dbOperations.getUserByEmail(email);
    if (!user) {
      return sendResponse(res, 401, false, 'Invalid credentials');
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return sendResponse(res, 401, false, 'Invalid credentials');
    }

    // Generate token
    const token = generateToken(user.id);

    sendResponse(res, 200, true, 'Login successful', {
      user: {
        id: user.id,
        fullName: user.full_name,
        email: user.email,
        role: user.role
      },
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    sendResponse(res, 500, false, 'Server error during login');
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    const user = await dbOperations.getUserById(req.user.id);
    if (!user) {
      return sendResponse(res, 404, false, 'User not found');
    }

    sendResponse(res, 200, true, 'User retrieved successfully', {
      id: user.id,
      fullName: user.full_name,
      email: user.email,
      role: user.role
    });
  } catch (error) {
    console.error('Get user error:', error);
    sendResponse(res, 500, false, 'Server error');
  }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Public
const logout = async (req, res) => {
  sendResponse(res, 200, true, 'Logout successful');
};

// Placeholder functions for other auth features
const getAllUsers = async (req, res) => {
  sendResponse(res, 501, false, 'Not implemented');
};

const getUserById = async (req, res) => {
  sendResponse(res, 501, false, 'Not implemented');
};

const updateProfile = async (req, res) => {
  sendResponse(res, 501, false, 'Not implemented');
};

const uploadProfilePicture = async (req, res) => {
  sendResponse(res, 501, false, 'Not implemented');
};

const changePassword = async (req, res) => {
  sendResponse(res, 501, false, 'Not implemented');
};

const deleteAccount = async (req, res) => {
  sendResponse(res, 501, false, 'Not implemented');
};

module.exports = {
  register,
  login,
  getMe,
  getAllUsers,
  getUserById,
  updateProfile,
  uploadProfilePicture,
  changePassword,
  logout,
  deleteAccount
};
