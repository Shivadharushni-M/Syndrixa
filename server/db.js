const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Use MONGODB_URI first, then fall back to MONGO_URI, then default
    const mongoURI = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/eventra';
    
    console.log('Attempting to connect to MongoDB...');
    console.log('MongoDB URI:', mongoURI);
    
    const conn = await mongoose.connect(mongoURI, {
      // Remove deprecated options
    });
    
    console.log(`MongoDB Connected Successfully: ${conn.connection.host}`);
    console.log(`Database Name: ${conn.connection.name}`);
    
    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
    });

    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('MongoDB connection closed through app termination');
      process.exit(0);
    });

  } catch (err) {
    console.error(`MongoDB Connection Error: ${err.message}`);
    console.error('Full error:', err);
    process.exit(1);
  }
};

module.exports = connectDB;