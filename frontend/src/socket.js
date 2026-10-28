import { io } from 'socket.io-client';

let socket = null;

export function connectSocket(token) {
  disconnectSocket();
  // Same-origin by default (dev proxy / nginx). For a split deploy set VITE_SOCKET_URL to the API origin.
  socket = io(import.meta.env.VITE_SOCKET_URL || '/', { auth: { token } });
  return socket;
}

export function getSocket() {
  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}
