const User = require('../models/User');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

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
    const { fullName, email, password, dob, confirmPassword } = req.body;

    // Validation
    if (!fullName || !email || !password || !dob) {
      return sendResponse(res, 400, false, 'Please provide all required fields');
    }

    if (password !== confirmPassword) {
      return sendResponse(res, 400, false, 'Passwords do not match');
    }

    if (password.length < 6) {
      return sendResponse(res, 400, false, 'Password must be at least 6 characters long');
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return sendResponse(res, 400, false, 'User with this email already exists');
    }

    // Create new user
    const user = await User.create({
      fullName,
      email,
      password,
      dob: new Date(dob),
      role: 'jobseeker'
    });

    // Generate token
    const token = generateToken(user._id);

    sendResponse(res, 201, true, 'User registered successfully', {
      user: {
        id: user._id,
        fullName: user.fullName,
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

    // Find user with password
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return sendResponse(res, 401, false, 'Invalid email or password');
    }

    // Check if password matches
    const isPasswordMatch = await user.comparePassword(password);
    if (!isPasswordMatch) {
      return sendResponse(res, 401, false, 'Invalid email or password');
    }

    // Check if user is active
    if (!user.isActive) {
      return sendResponse(res, 401, false, 'Your account has been deactivated');
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate token
    const token = generateToken(user._id);

    // Remove password from response
    user.password = undefined;

    sendResponse(res, 200, true, 'Login successful', {
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        lastLogin: user.lastLogin
      },
      token
    });

  } catch (error) {
    console.error('Login error:', error);
    sendResponse(res, 500, false, 'Server error during login');
  }
};

// @desc    Get current user profile with all details
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return sendResponse(res, 404, false, 'User not found');
    }

    // Return complete user profile
    const userProfile = {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      dob: user.dob,
      role: user.role,
      profile: user.profile || {},
      preferences: user.preferences || {},
      isActive: user.isActive,
      createdAt: user.createdAt,
      lastLogin: user.lastLogin
    };

    sendResponse(res, 200, true, 'User profile retrieved successfully', userProfile);

  } catch (error) {
    console.error('Get profile error:', error);
    sendResponse(res, 500, false, 'Server error while fetching profile');
  }
};

// @desc    Get all users (admin only)
// @route   GET /api/auth/users
// @access  Private (Admin only)
const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', role = '' } = req.query;
    
    // Build query
    const query = {};
    
    // Add role filter if specified
    if (role) {
      query.role = role;
    }
    
    // Add search filter
    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { 'profile.location': { $regex: search, $options: 'i' } }
      ];
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Get users with pagination
    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count for pagination
    const total = await User.countDocuments(query);

    sendResponse(res, 200, true, 'Users retrieved successfully', {
      users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });

  } catch (error) {
    console.error('Get all users error:', error);
    sendResponse(res, 500, false, 'Server error while fetching users');
  }
};

// @desc    Get user by ID (admin only)
// @route   GET /api/auth/users/:id
// @access  Private (Admin only)
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return sendResponse(res, 404, false, 'User not found');
    }

    sendResponse(res, 200, true, 'User retrieved successfully', user);

  } catch (error) {
    console.error('Get user by ID error:', error);
    sendResponse(res, 500, false, 'Server error while fetching user');
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/me
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const allowedFields = {
      fullName: req.body.fullName,
      'profile.phone': req.body.phone,
      'profile.location': req.body.location,
      'profile.bio': req.body.bio,
      'profile.skills': req.body.skills,
      'profile.experience': req.body.experience,
      'profile.education': req.body.education,
      'profile.linkedin': req.body.linkedin,
      'profile.github': req.body.github,
      'profile.portfolio': req.body.portfolio,
      'preferences.emailNotifications': req.body.emailNotifications,
      'preferences.pushNotifications': req.body.pushNotifications,
      'preferences.publicProfile': req.body.publicProfile,
      'preferences.showOnlineStatus': req.body.showOnlineStatus
    };

    // Remove undefined fields
    Object.keys(allowedFields).forEach(key => {
      if (allowedFields[key] === undefined) {
        delete allowedFields[key];
      }
    });

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: allowedFields },
      { new: true, runValidators: true }
    );

    if (!user) {
      return sendResponse(res, 404, false, 'User not found');
    }

    // Return updated user
    const updatedUser = await User.findById(req.user.id).select('-password');
    
    sendResponse(res, 200, true, 'Profile updated successfully', updatedUser);

  } catch (error) {
    console.error('Update profile error:', error);
    sendResponse(res, 500, false, 'Server error while updating profile');
  }
};

// @desc    Upload profile picture
// @route   POST /api/auth/upload-profile-picture
// @access  Private
const uploadProfilePicture = async (req, res) => {
  try {
    if (!req.file) {
      return sendResponse(res, 400, false, 'No file uploaded');
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return sendResponse(res, 404, false, 'User not found');
    }

    // Update profile picture path
    user.profile = user.profile || {};
    user.profile.profilePicture = `/uploads/${req.file.filename}`;
    await user.save();

    sendResponse(res, 200, true, 'Profile picture uploaded successfully', {
      profilePicture: user.profile.profilePicture
    });

  } catch (error) {
    console.error('Upload profile picture error:', error);
    sendResponse(res, 500, false, 'Server error while uploading profile picture');
  }
};

// @desc    Delete user account
// @route   DELETE /api/auth/me
// @access  Private
const deleteAccount = async (req, res) => {
  try {
    const { password } = req.body;

    if (!password) {
      return sendResponse(res, 400, false, 'Password is required to delete account');
    }

    // Get user with password
    const user = await User.findById(req.user.id).select('+password');
    if (!user) {
      return sendResponse(res, 404, false, 'User not found');
    }

    // Verify password
    const isPasswordMatch = await user.comparePassword(password);
    if (!isPasswordMatch) {
      return sendResponse(res, 400, false, 'Incorrect password');
    }

    // Delete user
    await User.findByIdAndDelete(req.user.id);

    sendResponse(res, 200, true, 'Account deleted successfully');

  } catch (error) {
    console.error('Delete account error:', error);
    sendResponse(res, 500, false, 'Server error while deleting account');
  }
};

// @desc    Change password
// @route   PUT /api/auth/change-password
// @access  Private
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return sendResponse(res, 400, false, 'Please provide current and new password');
    }

    if (newPassword.length < 6) {
      return sendResponse(res, 400, false, 'New password must be at least 6 characters long');
    }

    // Get user with password
    const user = await User.findById(req.user.id).select('+password');
    if (!user) {
      return sendResponse(res, 404, false, 'User not found');
    }

    // Check current password
    const isPasswordMatch = await user.comparePassword(currentPassword);
    if (!isPasswordMatch) {
      return sendResponse(res, 400, false, 'Current password is incorrect');
    }

    // Update password
    user.password = newPassword;
    await user.save();

    sendResponse(res, 200, true, 'Password changed successfully');

  } catch (error) {
    console.error('Change password error:', error);
    sendResponse(res, 500, false, 'Server error while changing password');
  }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
const logout = async (req, res) => {
  try {
    // In a real app, you might want to invalidate the token
    // For now, we'll just return success
    sendResponse(res, 200, true, 'Logout successful');
  } catch (error) {
    console.error('Logout error:', error);
    sendResponse(res, 500, false, 'Server error during logout');
  }
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
