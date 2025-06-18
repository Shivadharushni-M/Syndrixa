const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const eventController = require('../controllers/eventController');

// Protected routes - require authentication
router.get('/', protect, eventController.getAllEvents);
router.get('/:id', eventController.getEventById);

// Protected routes - require authentication
router.post('/', protect, eventController.createEvent);
router.put('/:id', protect, eventController.updateEvent);
router.delete('/:id', protect, authorize('president', 'management'), eventController.deleteEvent);

// Management approval routes
router.patch('/:id/approve', protect, authorize('management'), eventController.approveEvent);
router.patch('/:id/reject', protect, authorize('management'), eventController.rejectEvent);

// Additional protected routes if you have them (comment out if functions don't exist yet)
// router.get('/:id/registrations', protect, authorize('president', 'management'), eventController.getEventRegistrations);
// router.patch('/:id/status', protect, authorize('president', 'management'), eventController.updateEventStatus);

module.exports = router;
