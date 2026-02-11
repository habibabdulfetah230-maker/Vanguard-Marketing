import mongoose from 'mongoose';
import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';

// Load env vars
dotenv.config();

// Properly URL-encoded password for SRV format
const password = encodeURIComponent('$(Gang)22661434');
const username = 'habibabdulfetah230_db_user';

// Try SRV format
const uri = `mongodb+srv://${username}:${password}@cluster0.qhmuuje.mongodb.net/vanguard_db?retryWrites=true&w=majority`;

console.log('Attempting connection with SRV format...');
console.log('URI (password hidden):', uri.replace(password, '****'));

const app = express();
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

try {
  await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 10000,
    socketTimeoutMS: 45000,
  });
  console.log('[database] MongoDB connected successfully');
  console.log('[server] Server starting on port 5000');
  
  app.listen(5000, () => {
    console.log('[server] Server running on http://localhost:5000');
  });
} catch (error) {
  console.error('[database] MongoDB connection error:', error.message);
  console.error('[database] Full error:', error);
  process.exit(1);
}
