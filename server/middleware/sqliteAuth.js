const jwt = require('jsonwebtoken');

// Protect middleware - verify JWT token
const protect = async (req, res, next) => {
  let token;

  // Check for token in headers
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  // Check if token exists
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. No token provided.'
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    
    // Add user ID to request object
    req.user = { id: decoded.id };
    
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid token.'
    });
  }
};

// Authorize middleware - check user role
const authorize = (...roles) => {
  return (req, res, next) => {
    // For now, we'll skip role checking as we don't have user role in the token
    // In a real implementation, you would fetch user from database and check role
    next();
  };
};

module.exports = {
  protect,
  authorize
};
