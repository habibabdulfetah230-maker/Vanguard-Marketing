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
    
    // Try to connect with a shorter timeout
    await mongoose.connect(env.mongoUri, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    isConnected = true;
    console.log("[database] MongoDB connected successfully");
    console.log("[database] Database:", mongoose.connection.db.databaseName);
    return true;
  } catch (error) {
    console.error("[database] MongoDB connection error:", error.message);
    
    // If MongoDB Atlas fails, try local fallback
    if (error.message.includes('ECONNREFUSED') || error.message.includes('querySrv')) {
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
