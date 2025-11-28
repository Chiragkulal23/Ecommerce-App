import { io } from 'socket.io-client';

let socket = null;

export function connectAdminSocket() {
  const token = localStorage.getItem('adminToken');
  if (!token) return null;
  if (socket) return socket;

  socket = io('http://localhost:4000', {
    transports: ['websocket'],
    auth: { token },
    reconnection: true,
    reconnectionAttempts: 10,
    reconnectionDelay: 1000,
  });

  socket.on('connect_error', (err) => {
    console.error('Socket connect error:', err.message);
  });

  return socket;
}

export function getSocket() {
  return socket;
}

