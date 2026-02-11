import mongoose from "mongoose";
import env from "../config/env.js";
import { MongoMemoryServer } from "mongodb-memory-server";

let mongod = null;

const connectDatabase = async () => {
  try {
    // For development, use MongoDB memory server
    if (env.nodeEnv === "development") {
      mongod = await MongoMemoryServer.create();
      const uri = mongod.getUri();
      await mongoose.connect(uri);
      console.log("[database] Connected to MongoDB Memory Server");
    } else {
      // For production, use the configured URI
      await mongoose.connect(env.mongoUri, {
        serverSelectionTimeoutMS: 5000,
      });
      console.log("[database] Connected to MongoDB");
    }
  } catch (error) {
    console.error("[database] MongoDB connection error", error);
    throw error;
  }
};

// Cleanup function
const cleanupDatabase = async () => {
  if (mongod) {
    await mongod.stop();
  }
  await mongoose.disconnect();
};

export default connectDatabase;
export { cleanupDatabase };
