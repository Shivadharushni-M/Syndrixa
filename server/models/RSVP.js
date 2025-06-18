const mongoose = require('mongoose');

const rsvpSchema = new mongoose.Schema({
  event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event' },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, enum: ['attending', 'not_attending', 'maybe'], default: 'attending' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('RSVP', rsvpSchema);
