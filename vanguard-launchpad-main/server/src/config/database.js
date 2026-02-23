import mongoose from "mongoose";
import env from "../config/env.js";

let isConnected = false;

const connectDatabase = async () => {
  // If already connected, return
  if (isConnected && mongoose.connection.readyState === 1) {
    console.log("[database] Already connected to MongoDB");
    return true;
  }

  // Try MongoDB Atlas first if MONGODB_ATLAS_URI is set
  const atlasUri = process.env.MONGODB_ATLAS_URI || process.env.MONGODB_URI;
  const isAtlasUri = atlasUri?.includes('mongodb+srv://') || atlasUri?.includes('mongodb.net');
  
  if (isAtlasUri && atlasUri !== env.mongoUri) {
    console.log("[database] Attempting MongoDB Atlas connection...");
    try {
      await mongoose.connect(atlasUri, {
        serverSelectionTimeoutMS: 8000,
        socketTimeoutMS: 45000,
      });
      isConnected = true;
      console.log("[database] ✅ MongoDB Atlas connected successfully");
      console.log("[database] Database:", mongoose.connection.db.databaseName);
      return true;
    } catch (error) {
      console.error("[database] MongoDB Atlas failed:", error.message);
      console.log("[database] Falling back to local MongoDB...");
    }
  }

  // Try primary MongoDB URI
  try {
    if (!env.mongoUri) {
      console.error("[database] MONGODB_URI is not set in environment variables");
      return false;
    }

    console.log("[database] Connecting to MongoDB...");
    
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
