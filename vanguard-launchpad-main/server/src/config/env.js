import dotenv from "dotenv";

dotenv.config();

const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: process.env.PORT ? Number(process.env.PORT) : 5000,
  mongoUri: "mongodb://127.0.0.1:27017/vanguard_launchpad",
  jwt: {
    secret: process.env.JWT_SECRET || "vanguard-admin-secret-2024",
    expiresIn: process.env.JWT_EXPIRES_IN || "1d",
  },
  defaultAdmin: {
    email: process.env.DEFAULT_ADMIN_EMAIL || "admin@vanguard.com",
    password: process.env.DEFAULT_ADMIN_PASSWORD || "admin123",
    name: process.env.DEFAULT_ADMIN_NAME || "Super Admin",
  },
};

if (!env.jwt.secret || env.jwt.secret === "change-me") {
  console.warn("[warning] JWT_SECRET is not set. Update your .env file for production use.");
}

export default env;
