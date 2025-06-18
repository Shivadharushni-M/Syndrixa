const mongoose = require('mongoose');

const pollSchema = new mongoose.Schema({
  question: String,
  options: [String],
  votes: [{ userId: mongoose.Schema.Types.ObjectId, selectedOption: Number }],
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event' },
});

module.exports = mongoose.model('Poll', pollSchema);
