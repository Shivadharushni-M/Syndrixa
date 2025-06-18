const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Event title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Event description is required']
  },
  club: {
    type: String,
    required: [true, 'Club name is required'],
    trim: true
  },
  imageUrl: {
    type: String,
    default: null
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Event creator is required']
  },
  status: {
    type: String,
    enum: ['idea', 'pending', 'approved', 'live', 'completed', 'cancelled'],
    default: 'idea'
  },
  SOP: {
    type: String,
    default: null
  },
  startDate: {
    type: Date,
    required: [true, 'Event start date is required']
  },
  endDate: {
    type: Date,
    required: [true, 'Event end date is required']
  },
  location: {
    type: String,
    required: [true, 'Event location is required']
  },
  capacity: {
    type: Number,
    min: [1, 'Capacity must be at least 1'],
    required: [true, 'Event capacity is required']
  },
  registrationDeadline: {
    type: Date,
    required: [true, 'Registration deadline is required']
  },
  rolesAssigned: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    role: {
      type: String,
      required: true
    }
  }],
  budget: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Budget'
  },
  feedback: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Feedback'
  }],
  rsvpList: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'RSVP'
  }],
  registrations: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Registration'
  }],
  tags: [{
    type: String,
    trim: true
  }],
  requirements: {
    type: String,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Validate end date is after start date
eventSchema.pre('save', function(next) {
  if (this.endDate <= this.startDate) {
    next(new Error('End date must be after start date'));
  }
  if (this.registrationDeadline > this.startDate) {
    next(new Error('Registration deadline must be before event start date'));
  }
  next();
});

// Ensure registrations don't exceed capacity
eventSchema.methods.hasCapacity = function() {
  return this.registrations.length < this.capacity;
};

// Get remaining capacity
eventSchema.methods.getRemainingCapacity = function() {
  return this.capacity - this.registrations.length;
};

module.exports = mongoose.model('Event', eventSchema);
