import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const testConnections = async () => {
  console.log('\n🔍 Testing MongoDB Connections...\n');

  // Test 1: Current URI from .env
  console.log('Test 1: Current MONGODB_URI from .env');
  console.log('URI:', process.env.MONGODB_URI?.replace(/:[^:@]+@/, ':****@'));
  
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log('✅ SUCCESS: Connected with current URI\n');
    await mongoose.disconnect();
    return;
  } catch (error) {
    console.log('❌ FAILED:', error.message);
    console.log('');
  }

  // Test 2: Without authSource
  console.log('Test 2: Without authSource parameter');
  const uriWithoutAuth = process.env.MONGODB_URI?.replace('&authSource=admin', '');
  console.log('URI:', uriWithoutAuth?.replace(/:[^:@]+@/, ':****@'));
  
  try {
    await mongoose.connect(uriWithoutAuth, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log('✅ SUCCESS: Connected without authSource\n');
    console.log('💡 Solution: Remove &authSource=admin from your MONGODB_URI\n');
    await mongoose.disconnect();
    return;
  } catch (error) {
    console.log('❌ FAILED:', error.message);
    console.log('');
  }

  // Test 3: With different authSource
  console.log('Test 3: With authSource=vanguard_db');
  const uriWithDbAuth = process.env.MONGODB_URI?.replace('authSource=admin', 'authSource=vanguard_db');
  console.log('URI:', uriWithDbAuth?.replace(/:[^:@]+@/, ':****@'));
  
  try {
    await mongoose.connect(uriWithDbAuth, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log('✅ SUCCESS: Connected with authSource=vanguard_db\n');
    console.log('💡 Solution: Change authSource=admin to authSource=vanguard_db\n');
    await mongoose.disconnect();
    return;
  } catch (error) {
    console.log('❌ FAILED:', error.message);
    console.log('');
  }

  // Test 4: Local MongoDB
  console.log('Test 4: Local MongoDB fallback');
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/vanguard_db', {
      serverSelectionTimeoutMS: 3000,
    });
    console.log('✅ SUCCESS: Connected to local MongoDB\n');
    await mongoose.disconnect();
  } catch (error) {
    console.log('❌ FAILED:', error.message);
    console.log('');
  }

  console.log('\n⚠️  All MongoDB Atlas tests failed!');
  console.log('\n📋 Next Steps:');
  console.log('1. Go to https://cloud.mongodb.com/');
  console.log('2. Click "Database" → "Connect" on your cluster');
  console.log('3. Choose "Connect your application"');
  console.log('4. Copy the connection string');
  console.log('5. Replace <password> with your actual password');
  console.log('6. Update MONGODB_URI in .env file');
  console.log('');
};

testConnections()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Error:', error);
    process.exit(1);
  });
