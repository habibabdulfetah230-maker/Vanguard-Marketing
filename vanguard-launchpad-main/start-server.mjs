import { spawn } from 'child_process';

// Properly URL-encode the password
const password = encodeURIComponent('$(Gang)22661434');
const username = 'habibabdulfetah230_db_user';
const host = 'ac-rqntepk-shard-00-00.qhmuuje.mongodb.net:27017';

const uri = `mongodb://${username}:${password}@${host}/vanguard_db?tls=true&authSource=admin`;

console.log('Starting server with properly encoded password...');

const env = {
  ...process.env,
  MONGODB_URI: uri,
  DEFAULT_ADMIN_EMAIL: 'vanguardmarketing123@gmail.com',
  DEFAULT_ADMIN_PASSWORD: 'admin123456',
  DEFAULT_ADMIN_NAME: 'Habib abdulfetah',
  JWT_SECRET: 'super-secure-secret',
  PORT: '5000'
};

const server = spawn('node', ['server/src/server.js'], {
  env,
  stdio: 'inherit',
  cwd: process.cwd()
});

server.on('error', (err) => {
  console.error('Failed to start server:', err);
});

server.on('exit', (code) => {
  console.log(`Server exited with code ${code}`);
});
