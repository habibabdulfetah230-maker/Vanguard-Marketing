import { MongoMemoryServer } from 'mongodb-memory-server';

console.log('Starting in-memory MongoDB server...');

const mongod = await MongoMemoryServer.create({
  instance: {
    port: 27017,
    dbName: 'vanguard_db',
  },
});

const uri = mongod.getUri();
console.log('✓ MongoDB Memory Server started successfully!');
console.log('URI:', uri);
console.log('Port: 27017');
console.log('Database: vanguard_db');
console.log('\nPress Ctrl+C to stop the server');

// Keep the process running
process.on('SIGINT', async () => {
  console.log('\nStopping MongoDB Memory Server...');
  await mongod.stop();
  console.log('✓ Server stopped');
  process.exit(0);
});

// Keep alive
await new Promise(() => {});
