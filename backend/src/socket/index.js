import { Server } from 'socket.io';
import { initializeMatchmaking } from './matchmaking.js';

export function initializeSocket(httpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL || 'https://syncly-six.vercel.app',
      credentials: true
    }
  });

  initializeMatchmaking(io);

  return io;
}
