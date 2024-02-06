// socket.js
import { io } from 'socket.io-client';

export const initSocket = async () => {
  const options = {
    withCredentials: true,
    'force new connection': true,
    reconnectionAttempt: 'Infinity',
    timeout: 1000,
    transports: ['websocket'],
  };

  try {
    const socket = io("http://localhost:5050", options);
    await socket.connect();
    console.log('Socket connected with the id:', socket.id);
    return socket;
  } catch (error) {
    console.error('Error connecting to socket:', error.message);
    throw error;
  }
};
