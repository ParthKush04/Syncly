import 'dotenv/config';
import http from 'node:http';
import { createApp } from './app.js';
import { connectDB } from './config/db.js';
import { initializeSocket } from './socket/index.js';
import User from './models/User.js';

const app = await createApp();
const server = http.createServer(app);
initializeSocket(server);

const port = Number(process.env.PORT) || 5000;

async function startServer() {
  // Fail fast if the database cannot be reached.
  await connectDB();
  await User.updateMany({ linkedinUrl: '' }, { $unset: { linkedinUrl: '' } });
  await User.updateMany({ linkedinUrl: null }, { $unset: { linkedinUrl: '' } });
  await User.updateMany({ googleId: null }, { $unset: { googleId: '' } });
  await User.updateMany({ linkedinId: null }, { $unset: { linkedinId: '' } });

  try {
    await User.collection.dropIndex('googleId_1');
  } catch {
    // The old index may not exist on fresh databases.
  }

  try {
    await User.collection.dropIndex('linkedinId_1');
  } catch {
    // The old index may not exist on fresh databases.
  }

  try {
    await User.collection.dropIndex('linkedinUrl_1');
  } catch {
    // The old index may not exist on fresh databases.
  }

  await User.syncIndexes();

  server.listen(port, () => {
    console.log(`Backend running on port ${port}`);
  });
}

function shutdown(signal) {
  console.log(`Received ${signal}, shutting down gracefully...`);
  server.close(() => {
    process.exit(0);
  });
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

startServer().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
