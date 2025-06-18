const mongoose = require('mongoose')

const registrationSchema = new mongoose.Schema({
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  rollNumber: {
    type: String,
    required: true
  },
  course: {
    type: String,
    required: true
  },
  year: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: String,
    required: true
  },
  dietaryRequirements: {
    type: String,
    default: ''
  },
  specialRequests: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['registered', 'cancelled'],
    default: 'registered'
  },
  registrationDate: {
    type: Date,
    default: Date.now
  },
  feedback: {
    rating: {
      type: Number,
      min: 1,
      max: 10
    },
    feedback: String,
    enjoyment: {
      type: String,
      enum: ['yes', 'no', 'neutral']
    },
    improvements: String,
    submittedAt: Date
  }
})

// Add indexes for better query performance
registrationSchema.index({ eventId: 1, userId: 1 })
registrationSchema.index({ userId: 1, status: 1 })

const Registration = mongoose.model('Registration', registrationSchema)

module.exports = Registration 