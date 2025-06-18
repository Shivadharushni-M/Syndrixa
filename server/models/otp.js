const mongoose = require('mongoose');

// Defining OTP schema for temporary storage
const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please enter a valid email']
  },
  otp: {
    type: String,
    required: true,
    length: 6
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 300, // OTP expires after 5 minutes (300 seconds)
  },
  // Remove this field since we're using automatic expiration
  // expiresAt: {
  //   type: Date
  // }
}, {
  timestamps: true
});

// Index for faster queries - remove the duplicate expiration index
otpSchema.index({ email: 1 });
// Remove this line: otpSchema.index({ createdAt: 1 }, { expireAfterSeconds: 300 });

// Static method to verify OTP
otpSchema.statics.verifyOTP = async function(email, otp) {
  try {
    const otpRecord = await this.findOne({ 
      email: email.toLowerCase(), 
      otp: otp 
    });
    return otpRecord !== null;
  } catch (error) {
    throw new Error('OTP verification failed');
  }
};

// Static method to clean expired OTPs (optional, since MongoDB handles it automatically)
otpSchema.statics.cleanExpiredOTPs = async function() {
  try {
    const result = await this.deleteMany({
      createdAt: { $lt: new Date(Date.now() - 5 * 60 * 1000) }
    });
    console.log(`Cleaned ${result.deletedCount} expired OTP records`);
    return result;
  } catch (error) {
    console.error('Error cleaning expired OTPs:', error);
  }
};

// Exporting OTP model
module.exports = mongoose.model('OTP', otpSchema);