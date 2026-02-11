import { MongoClient } from 'mongodb';
import mongoose from 'mongoose';

// Properly URL-encoded password
const password = encodeURIComponent('$(Gang)22661434');
const username = 'habibabdulfetah230_db_user';
const cluster = 'ac-rqntepk-shard-00-00.qhmuuje.mongodb.net:27017,ac-rqntepk-shard-00-01.qhmuuje.mongodb.net:27017,ac-rqntepk-shard-00-02.qhmuuje.mongodb.net:27017';

const uri = `mongodb://${username}:${password}@${cluster}/vanguard_db?tls=true&replicaSet=atlas-rqntepk-shard-0&authSource=admin&retryWrites=true&w=majority`;

console.log('Connecting with URI (password hidden):', uri.replace(password, '****'));

try {
  await mongoose.connect(uri);
  console.log('[database] MongoDB connected successfully');
  
  // Import and start server
  const { default: startServer } = await import('./server.js');
} catch (error) {
  console.error('[database] MongoDB connection error', error.message);
  process.exit(1);
}
