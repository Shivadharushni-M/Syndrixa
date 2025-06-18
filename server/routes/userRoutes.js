const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  sendOTP,
  verifyOTPAndRegister,
  loginUser,
  verifyLoginOTP,
  logoutUser,
  getProfile
} = require('../controllers/userController');

// Public routes
router.post('/send-otp', sendOTP);
router.post('/verify-otp-register', verifyOTPAndRegister);
router.post('/login', loginUser);
router.post('/verify-login-otp', verifyLoginOTP);

// Protected routes
router.post('/logout', protect, logoutUser);
router.get('/profile', protect, getProfile);

module.exports = router;
