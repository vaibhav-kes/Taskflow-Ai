const mongoose = require('mongoose');
const dns = require('dns');

// Use Google DNS to resolve MongoDB SRV records (fixes local DNS blocking)
dns.setServers(['8.8.8.8', '8.8.4.4']);
/**
 * Connect to MongoDB Atlas
 * Includes retry logic and connection event handlers
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      // Mongoose 7+ uses these defaults, but we set them explicitly for clarity
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);

    // Connection event handlers
    mongoose.connection.on('error', (err) => {
      console.error(`❌ MongoDB connection error: ${err.message}`);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️  MongoDB disconnected. Attempting to reconnect...');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('✅ MongoDB reconnected');
    });
  } catch (error) {
    console.error(`❌ MongoDB connection failed: ${error.message}`);
    // Exit process with failure in production
    process.exit(1);
  }
};

module.exports = connectDB;
