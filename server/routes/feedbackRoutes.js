const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/feedbackController');

// Create feedback
router.post('/', feedbackController.createFeedback);

// Get all feedback
router.get('/', feedbackController.getAllFeedback);

// Get feedback by ID
router.get('/:id', feedbackController.getFeedbackById);

// Get feedback by event ID
router.get('/event/:eventId', feedbackController.getFeedbackByEvent);

// Delete feedback
router.delete('/:id', feedbackController.deleteFeedback);

module.exports = router;