const Event = require('../models/Event');

// Create event
exports.createEvent = async (req, res) => {
  try {
    // Set status based on user role
    let status = 'idea';
    if (req.user.role === 'president') {
      status = 'pending'; // Presidents create events that need approval
    } else if (req.user.role === 'management') {
      status = 'approved'; // Management can create approved events directly
    }

    // Add user as creator
    const event = await Event.create({
      ...req.body,
      createdBy: req.user._id,
      status: status
    });

    res.status(201).json({
      success: true,
      message: `Event created successfully${status === 'pending' ? ' and sent for approval' : ''}`,
      data: event
    });
  } catch (error) {
    console.error('Create event error:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation Error',
        errors: Object.values(error.errors).map(e => e.message)
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error creating event',
      error: error.message
    });
  }
};

// Get all events (filtered by user role)
exports.getAllEvents = async (req, res) => {
  try {
    let query = {};
    
    // If user is logged in, filter based on role
    if (req.user) {
      if (req.user.role === 'student') {
        // Students only see approved and live events
        query.status = { $in: ['approved', 'live'] };
      } else if (req.user.role === 'president') {
        // Presidents see their own events and approved/live events
        query.$or = [
          { createdBy: req.user._id },
          { status: { $in: ['approved', 'live'] } }
        ];
      }
      // Management sees all events
    }

    const events = await Event.find(query)
      .populate('createdBy', 'name email')
      .populate('budget')
      .populate('feedback')
      .populate('rsvpList')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: events.length,
      data: events
    });
  } catch (error) {
    console.error('Get all events error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching events',
      error: error.message
    });
  }
};

// Get event by ID
exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('createdBy', 'name email')
      .populate('budget')
      .populate('feedback')
      .populate('rsvpList');

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    res.status(200).json({
      success: true,
      data: event
    });
  } catch (error) {
    console.error('Get event error:', error);

    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid event ID'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error fetching event',
      error: error.message
    });
  }
};

// Update event
exports.updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Check if user is the creator or has management role
    if (event.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'management') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this event'
      });
    }

    const updated = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Event updated successfully',
      data: updated
    });
  } catch (error) {
    console.error('Update event error:', error);

    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation Error',
        errors: Object.values(error.errors).map(e => e.message)
      });
    }

    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid event ID'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error updating event',
      error: error.message
    });
  }
};

// Delete event
exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Check if user is the creator or has management role
    if (event.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'management') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this event'
      });
    }

    await Event.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Event deleted successfully'
    });
  } catch (error) {
    console.error('Delete event error:', error);

    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid event ID'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error deleting event',
      error: error.message
    });
  }
};

// Approve event (management only)
exports.approveEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    if (event.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Event is not pending approval'
      });
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      { status: 'approved' },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Event approved successfully',
      data: updatedEvent
    });
  } catch (error) {
    console.error('Approve event error:', error);

    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid event ID'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error approving event',
      error: error.message
    });
  }
};

// Reject event (management only)
exports.rejectEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    if (event.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Event is not pending approval'
      });
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      { status: 'cancelled' },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Event rejected successfully',
      data: updatedEvent
    });
  } catch (error) {
    console.error('Reject event error:', error);

    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid event ID'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error rejecting event',
      error: error.message
    });
  }
};
