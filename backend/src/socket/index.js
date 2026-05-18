import { Server } from 'socket.io';
import { initializeMatchmaking } from './matchmaking.js';

export function initializeSocket(httpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:5173',
      credentials: true
    }
  });

  initializeMatchmaking(io);

  return io;
}
