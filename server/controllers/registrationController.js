const Registration = require('../models/Registration')
const Event = require('../models/Event')
const mongoose = require('mongoose')

// Create a new registration
exports.createRegistration = async (req, res) => {
  try {
    console.log('\n=== Create Registration ===')
    console.log('Request:', {
      params: req.params,
      body: req.body,
      user: req.user
    })

    // Validate request body
    const requiredFields = ['name', 'rollNumber', 'course', 'year', 'phoneNumber']
    const missingFields = requiredFields.filter(field => !req.body[field])
    
    if (missingFields.length > 0) {
      console.log('Missing required fields:', missingFields)
      return res.status(400).json({
        success: false,
        message: 'Missing required fields',
        fields: missingFields
      })
    }

    const { eventId } = req.params
    const { name, rollNumber, course, year, phoneNumber, dietaryRequirements, specialRequests } = req.body
    
    if (!req.user || !req.user._id) {
      console.log('Authentication error: User not found in request')
      return res.status(401).json({ 
        success: false,
        message: 'User not authenticated' 
      })
    }
    
    const userId = req.user._id

    // Validate eventId format
    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      console.log('Invalid eventId format:', eventId)
      return res.status(400).json({
        success: false,
        message: 'Invalid event ID format'
      })
    }

    // Check if event exists
    const event = await Event.findById(eventId)
    if (!event) {
      console.log('Event not found:', eventId)
      return res.status(404).json({ 
        success: false,
        message: 'Event not found' 
      })
    }

    // Check if user is already registered
    const existingRegistration = await Registration.findOne({
      eventId,
      userId,
      status: 'registered'
    })

    if (existingRegistration) {
      console.log('User already registered:', { userId, eventId })
      return res.status(400).json({ 
        success: false,
        message: 'You are already registered for this event' 
      })
    }

    // Create new registration
    const registration = new Registration({
      eventId,
      userId,
      name,
      rollNumber,
      course,
      year,
      phoneNumber,
      dietaryRequirements: dietaryRequirements || '',
      specialRequests: specialRequests || '',
      status: 'registered'
    })

    console.log('Saving registration:', registration)
    const savedRegistration = await registration.save()
    console.log('Registration saved successfully:', savedRegistration)

    return res.status(201).json({
      success: true,
      message: 'Registration successful',
      registration: savedRegistration
    })
  } catch (error) {
    console.error('\n=== Registration Error ===')
    console.error('Error:', error)
    console.error('Stack:', error.stack)

    // Handle mongoose validation errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation Error',
        errors: Object.values(error.errors).map(e => e.message)
      })
    }

    return res.status(500).json({ 
      success: false,
      message: 'Error creating registration', 
      error: error.message 
    })
  }
}

// Get user's registrations
exports.getUserRegistrations = async (req, res) => {
  try {
    console.log('\n=== Get User Registrations ===')
    console.log('Request:', {
      user: req.user
    })

    if (!req.user || !req.user._id) {
      console.log('Authentication error: User not found in request')
      return res.status(401).json({ 
        success: false,
        message: 'User not authenticated' 
      })
    }
    
    const userId = req.user._id

    const registrations = await Registration.find({ userId })
      .populate('eventId', 'title description startDate endDate location club status')
      .sort({ registrationDate: -1 })

    console.log('Found registrations:', registrations.length)

    return res.status(200).json({
      success: true,
      registrations
    })
  } catch (error) {
    console.error('\n=== Get Registrations Error ===')
    console.error('Error:', error)
    console.error('Stack:', error.stack)

    return res.status(500).json({ 
      success: false,
      message: 'Error fetching registrations', 
      error: error.message 
    })
  }
}

// Cancel registration
exports.cancelRegistration = async (req, res) => {
  try {
    console.log('\n=== Cancel Registration ===')
    console.log('Request:', {
      params: req.params,
      user: req.user
    })

    if (!req.user || !req.user._id) {
      console.log('Authentication error: User not found in request')
      return res.status(401).json({ 
        success: false,
        message: 'User not authenticated' 
      })
    }
    
    const { registrationId } = req.params
    const userId = req.user._id

    // Validate registrationId format
    if (!mongoose.Types.ObjectId.isValid(registrationId)) {
      console.log('Invalid registrationId format:', registrationId)
      return res.status(400).json({
        success: false,
        message: 'Invalid registration ID format'
      })
    }

    const registration = await Registration.findOne({
      _id: registrationId,
      userId,
      status: 'registered'
    })

    if (!registration) {
      console.log('Registration not found:', registrationId)
      return res.status(404).json({ 
        success: false,
        message: 'Registration not found or already cancelled' 
      })
    }

    registration.status = 'cancelled'
    await registration.save()
    console.log('Registration cancelled successfully:', registrationId)

    return res.status(200).json({ 
      success: true,
      message: 'Registration cancelled successfully' 
    })
  } catch (error) {
    console.error('\n=== Cancel Registration Error ===')
    console.error('Error:', error)
    console.error('Stack:', error.stack)

    return res.status(500).json({ 
      success: false,
      message: 'Error cancelling registration', 
      error: error.message 
    })
  }
}

// Submit feedback
exports.submitFeedback = async (req, res) => {
  try {
    console.log('\n=== Submit Feedback ===')
    console.log('Request:', {
      params: req.params,
      body: req.body,
      user: req.user
    })

    if (!req.user || !req.user._id) {
      console.log('Authentication error: User not found in request')
      return res.status(401).json({ 
        success: false,
        message: 'User not authenticated' 
      })
    }
    
    const { registrationId } = req.params
    const { rating, feedback, enjoyment, improvements } = req.body
    const userId = req.user._id

    // Validate registrationId format
    if (!mongoose.Types.ObjectId.isValid(registrationId)) {
      console.log('Invalid registrationId format:', registrationId)
      return res.status(400).json({
        success: false,
        message: 'Invalid registration ID format'
      })
    }

    // Validate feedback data
    if (!rating || !feedback || !enjoyment) {
      console.log('Missing required feedback fields')
      return res.status(400).json({
        success: false,
        message: 'Missing required feedback fields'
      })
    }

    const registration = await Registration.findOne({
      _id: registrationId,
      userId,
      status: 'registered'
    })

    if (!registration) {
      console.log('Registration not found:', registrationId)
      return res.status(404).json({ 
        success: false,
        message: 'Registration not found' 
      })
    }

    registration.feedback = {
      rating,
      feedback,
      enjoyment,
      improvements: improvements || '',
      submittedAt: new Date()
    }

    await registration.save()
    console.log('Feedback submitted successfully:', registrationId)

    return res.status(200).json({ 
      success: true,
      message: 'Feedback submitted successfully' 
    })
  } catch (error) {
    console.error('\n=== Submit Feedback Error ===')
    console.error('Error:', error)
    console.error('Stack:', error.stack)

    return res.status(500).json({ 
      success: false,
      message: 'Error submitting feedback', 
      error: error.message 
    })
  }
}

// Get registrations for a specific event (Admin only)
exports.getEventRegistrations = async (req, res) => {
  try {
    console.log('\n=== Get Event Registrations ===')
    console.log('Request:', {
      params: req.params,
      user: req.user
    })

    const { eventId } = req.params

    // Validate eventId format
    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      console.log('Invalid eventId format:', eventId)
      return res.status(400).json({
        success: false,
        message: 'Invalid event ID format'
      })
    }

    // Check if event exists
    const event = await Event.findById(eventId)
    if (!event) {
      console.log('Event not found:', eventId)
      return res.status(404).json({ 
        success: false,
        message: 'Event not found' 
      })
    }

    const registrations = await Registration.find({ eventId })
      .populate('userId', 'name email')
      .populate('eventId', 'title description startDate endDate')
      .sort({ registrationDate: -1 })

    console.log('Found registrations for event:', registrations.length)

    return res.status(200).json({
      success: true,
      count: registrations.length,
      registrations
    })
  } catch (error) {
    console.error('\n=== Get Event Registrations Error ===')
    console.error('Error:', error)
    console.error('Stack:', error.stack)

    return res.status(500).json({ 
      success: false,
      message: 'Error fetching event registrations', 
      error: error.message 
    })
  }
}

// Get all registrations (Admin only)
exports.getAllRegistrations = async (req, res) => {
  try {
    console.log('\n=== Get All Registrations ===')
    console.log('Request user:', req.user)

    const registrations = await Registration.find()
      .populate('userId', 'name email')
      .populate('eventId', 'title description startDate endDate club')
      .sort({ registrationDate: -1 })

    console.log('Found total registrations:', registrations.length)

    return res.status(200).json({
      success: true,
      count: registrations.length,
      registrations
    })
  } catch (error) {
    console.error('\n=== Get All Registrations Error ===')
    console.error('Error:', error)
    console.error('Stack:', error.stack)

    return res.status(500).json({ 
      success: false,
      message: 'Error fetching all registrations', 
      error: error.message 
    })
  }
}