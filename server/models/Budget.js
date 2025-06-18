const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema({
  event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event' },
  totalAmount: { type: Number, required: true },
  items: [{
    description: String,
    amount: Number,
    category: String
  }],
  status: { type: String, enum: ['submitted', 'pending', 'reviewed', 'approved', 'rejected'], default: 'submitted' },
  submittedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Budget', budgetSchema);
