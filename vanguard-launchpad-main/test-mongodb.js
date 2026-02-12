import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const testConnection = async () => {
  console.log('Testing MongoDB connection...');
  console.log('MongoDB URI:', process.env.MONGODB_URI ? 'Found' : 'NOT FOUND');
  
  if (!process.env.MONGODB_URI) {
    console.error('ERROR: MONGODB_URI not found in environment variables');
    process.exit(1);
  }

  // Show partial URI for debugging (hide password)
  const uriParts = process.env.MONGODB_URI.split('@');
  if (uriParts.length > 1) {
    console.log('Connecting to:', uriParts[1]);
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });
    
    console.log('✓ MongoDB connected successfully!');
    console.log('Database:', mongoose.connection.db.databaseName);
    
    // Test a simple query
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('Collections:', collections.map(c => c.name).join(', ') || 'None');
    
    await mongoose.disconnect();
    console.log('✓ Test completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('✗ MongoDB connection failed:');
    console.error('Error:', error.message);
    
    if (error.message.includes('ECONNREFUSED')) {
      console.error('\nPossible causes:');
      console.error('1. IP address not whitelisted in MongoDB Atlas');
      console.error('2. Network/firewall blocking connection');
      console.error('3. MongoDB cluster is paused or doesn\'t exist');
    } else if (error.message.includes('authentication')) {
      console.error('\nAuthentication failed - check username/password');
    }
    
    process.exit(1);
  }
};

testConnection();
