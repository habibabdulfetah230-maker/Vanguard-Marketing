import mongoose from "mongoose";
import env from "../config/env.js";

let isConnected = false;

const connectDatabase = async () => {
  // If already connected, return
  if (isConnected && mongoose.connection.readyState === 1) {
    console.log("[database] Already connected to MongoDB");
    return true;
  }

  try {
    if (!env.mongoUri) {
      console.error("[database] MONGODB_URI is not set in environment variables");
      return false;
    }

    console.log("[database] Connecting to MongoDB...");
    
    // Try to connect with proper authentication settings
    await mongoose.connect(env.mongoUri, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      authSource: 'admin', // Specify auth source
    });

    isConnected = true;
    console.log("[database] MongoDB connected successfully");
    console.log("[database] Database:", mongoose.connection.db.databaseName);
    return true;
  } catch (error) {
    console.error("[database] MongoDB connection error:", error.message);
    
    // If MongoDB Atlas fails, try local fallback
    if (error.message.includes('ECONNREFUSED') || error.message.includes('querySrv') || error.message.includes('ENOTFOUND')) {
      console.log("[database] Trying local MongoDB fallback...");
      
      try {
        const localUri = "mongodb://127.0.0.1:27017/vanguard_db";
        await mongoose.connect(localUri, {
          serverSelectionTimeoutMS: 3000,
        });
        
        isConnected = true;
        console.log("[database] Connected to local MongoDB");
        return true;
      } catch (localError) {
        console.error("[database] Local MongoDB also failed:", localError.message);
        console.error("[database] ⚠️  Running without database - API calls will fail");
        console.error("[database] To fix: Install MongoDB locally OR whitelist your IP in MongoDB Atlas");
        return false;
      }
    }
    
    // If it's an authentication error, don't try local fallback
    if (error.message.includes('bad auth') || error.message.includes('Authentication failed')) {
      console.error("[database] ⚠️  Authentication failed - check your MongoDB credentials");
      console.error("[database] Username and password in MONGODB_URI may be incorrect");
      console.error("[database] Or the database user may not have proper permissions");
      return false;
    }
    
    console.error("[database] ⚠️  Running without database - API calls will fail");
    return false;
  }
};

// Handle connection events
mongoose.connection.on('disconnected', () => {
  isConnected = false;
  console.log("[database] MongoDB disconnected");
});

mongoose.connection.on('error', (err) => {
  console.error("[database] MongoDB error:", err.message);
});

export default connectDatabase;
