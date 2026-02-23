import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const testAtlas = async () => {
  const atlasUri = process.env.MONGODB_ATLAS_URI;
  
  console.log('\n🔍 Testing MongoDB Atlas Connection...\n');
  console.log('URI:', atlasUri?.replace(/:[^:@]+@/, ':****@'));
  console.log('');

  try {
    await mongoose.connect(atlasUri, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log('✅ SUCCESS: Connected to MongoDB Atlas!');
    console.log('Database:', mongoose.connection.db.databaseName);
    console.log('');
    console.log('🎉 Your MongoDB Atlas connection is working!');
    console.log('You can now use this in production (Render).');
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.log('❌ FAILED:', error.message);
    console.log('');
    
    if (error.message.includes('bad auth') || error.message.includes('Authentication failed')) {
      console.log('⚠️  Authentication Error:');
      console.log('- Username or password is incorrect');
      console.log('- Or the database user doesn\'t have proper permissions');
      console.log('');
      console.log('Fix:');
      console.log('1. Go to https://cloud.mongodb.com/');
      console.log('2. Click "Database Access"');
      console.log('3. Verify user exists and password is correct');
      console.log('4. Make sure user has "Read and write to any database" permission');
    } else if (error.message.includes('ECONNREFUSED') || error.message.includes('querySrv') || error.message.includes('ENOTFOUND')) {
      console.log('⚠️  Network/DNS Error:');
      console.log('- Cannot reach MongoDB Atlas servers');
      console.log('- Cluster might be paused or deleted');
      console.log('- Or there\'s a network/firewall issue');
      console.log('');
      console.log('Fix:');
      console.log('1. Go to https://cloud.mongodb.com/');
      console.log('2. Check if your cluster is active (not paused)');
      console.log('3. Go to "Network Access" and whitelist 0.0.0.0/0');
      console.log('4. Try getting a fresh connection string from "Connect" button');
    } else {
      console.log('⚠️  Unknown Error:');
      console.log(error);
    }
    
    process.exit(1);
  }
};

testAtlas();
