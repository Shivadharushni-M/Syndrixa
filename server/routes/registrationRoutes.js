const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const registrationController = require('../controllers/registrationController');

// Protected routes - all require authentication
router.post('/events/:eventId/register', protect, registrationController.createRegistration);
router.get('/user', protect, registrationController.getUserRegistrations);
router.patch('/:registrationId/cancel', protect, registrationController.cancelRegistration);
router.post('/:registrationId/feedback', protect, registrationController.submitFeedback);

// Admin routes - require specific roles
router.get('/events/:eventId', protect, authorize('president', 'management'), registrationController.getEventRegistrations);
router.get('/all', protect, authorize('president', 'management'), registrationController.getAllRegistrations);

module.exports = router;