const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  message: String,
  sentTo: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Notification', notificationSchema);
