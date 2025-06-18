const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Main authentication middleware
const protect = async (req, res, next) => {
  try {
    console.log('\n=== Auth Middleware ===');
    console.log('Headers:', req.headers);
    console.log('Authorization header:', req.headers.authorization);

    // 1) Check if token exists
    let token;
    
    // Check Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
      console.log('Token found in Authorization header');
    }
    // Check cookies as fallback
    else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
      console.log('Token found in cookies');
    }

    if (!token) {
      console.log('No token provided');
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }

    console.log('Token found:', token);

    // 2) Verify JWT_SECRET exists
    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET is not defined in environment variables');
      return res.status(500).json({
        success: false,
        message: 'Server configuration error - JWT_SECRET missing'
      });
    }

    // 3) Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('Token decoded successfully:', { 
        id: decoded.id, 
        email: decoded.email,
        role: decoded.role
      });
    } catch (error) {
      console.error('Token verification error:', error);
      
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          message: 'Your session has expired. Please log in again.'
        });
      }
      
      if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({
          success: false,
          message: 'Invalid token. Please log in again.'
        });
      }
      
      return res.status(401).json({
        success: false,
        message: 'Token verification failed. Please log in again.'
      });
    }

    // 4) Check if user still exists
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      console.log('User not found for ID:', decoded.id);
      return res.status(401).json({
        success: false,
        message: 'The user belonging to this token no longer exists.'
      });
    }

    console.log('User authenticated successfully:', { 
      id: user._id, 
      email: user.email,
      role: user.role
    });

    // 5) Grant access to protected route
    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error authenticating user',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Authentication failed'
    });
  }
};

// Optional middleware - for routes that work with or without auth
const optionalAuth = async (req, res, next) => {
  try {
    console.log('\n=== Optional Auth Middleware ===');
    
    let token;
    
    // Check Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    // Check cookies as fallback
    else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (token && process.env.JWT_SECRET) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select('-password');
        
        if (user) {
          req.user = user;
          console.log('Optional auth successful for user:', user._id);
        }
      } catch (error) {
        console.log('Optional auth failed, continuing without user:', error.message);
      }
    }
    
    next();
  } catch (error) {
    console.log('Optional auth error, continuing without user:', error.message);
    next();
  }
};

// Role-based authorization middleware
const authorize = (...roles) => {
  return (req, res, next) => {
    console.log('\n=== Role Authorization ===');
    console.log('Required roles:', roles);
    console.log('User role:', req.user?.role);
    
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. Please log in.'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Required roles: ${roles.join(', ')}`
      });
    }

    console.log('Role authorization successful');
    next();
  };
};

// Middleware to check if user is verified
const requireVerified = (req, res, next) => {
  console.log('\n=== Verification Check ===');
  console.log('User verified status:', req.user?.isVerified);
  
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. Please log in.'
    });
  }

  if (!req.user.isVerified) {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Please verify your email first.'
    });
  }

  console.log('Verification check passed');
  next();
};

module.exports = {
  protect,
  optionalAuth,
  authorize,
  requireVerified
};