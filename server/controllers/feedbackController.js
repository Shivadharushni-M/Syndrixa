const Feedback = require('../models/Feedback');

// Feedback controller
exports.createFeedback = async (req, res) => {
  try {
    console.log('Creating feedback with data:', req.body);
    const feedback = await Feedback.create(req.body);
    console.log('Feedback created successfully:', feedback);
    res.status(201).json({
      success: true,
      data: feedback
    });
  } catch (err) {
    console.error('Error creating feedback:', err);
    res.status(400).json({ 
      success: false,
      error: err.message 
    });
  }
};

exports.getAllFeedback = async (req, res) => {
  try {
    const feedbacks = await Feedback.find()
      .populate('event')
      .populate('user');
    res.status(200).json({
      success: true,
      data: feedbacks
    });
  } catch (err) {
    console.error('Error fetching feedbacks:', err);
    res.status(500).json({ 
      success: false,
      error: err.message 
    });
  }
};


exports.getFeedbackById = async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id)
      .populate('event')
      .populate('user');
    if (!feedback) {
      return res.status(404).json({ 
        success: false,
        error: 'Feedback not found' 
      });
    }
    res.status(200).json({
      success: true,
      data: feedback
    });
  } catch (err) {
    console.error('Error fetching feedback:', err);
    res.status(500).json({ 
      success: false,
      error: err.message 
    });
  }
};

exports.getFeedbackByEvent = async (req, res) => {
  try {
    const feedbacks = await Feedback.find({ event: req.params.eventId })
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: feedbacks
    });
  } catch (err) {
    console.error('Error fetching event feedbacks:', err);
    res.status(500).json({ 
      success: false,
      error: err.message 
    });
  }
};

exports.deleteFeedback = async (req, res) => {
  try {
    const deleted = await Feedback.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ 
        success: false,
        error: 'Feedback not found' 
      });
    }
    res.status(200).json({ 
      success: true,
      message: 'Feedback deleted successfully' 
    });
  } catch (err) {
    console.error('Error deleting feedback:', err);
    res.status(500).json({ 
      success: false,
      error: err.message 
    });
  }
};
