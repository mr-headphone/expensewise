// This file connects our app to MongoDB database
import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    // Try to connect using the URL in our .env file
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    // If connection fails, show error and stop the app
    console.error(`❌ MongoDB connection failed: ${error.message}`);
    process.exit(1);
  }
};