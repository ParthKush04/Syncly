import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || import.meta.env.VITE_API_URL || 'https://syncly-3nm4.onrender.com';

export function createMatchmakingSocket(token) {
  return io(SOCKET_URL, {
    withCredentials: true,
    auth: token ? { token } : undefined,
    transports: ['polling'],
    upgrade: false
  });
}