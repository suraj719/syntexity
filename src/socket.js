// socket.js
import { io } from 'socket.io-client';

const options = {
    withCredentials: true,
    'force new connection': true,
    reconnectionAttempt: 'Infinity',
    timeout: 1000,
    transports: ['websocket'],
};

const socket = io('http://localhost:5000', options);

// Function to initialize the socket
export const initSocket = () => {
    return socket;
};

// Function to listen for incoming chat messages
export const initChat = (roomId, setChatMessages) => {
    socket.on('RECEIVE_MESSAGE', ({ username, message }) => {
        setChatMessages((prevMessages) => [
            ...prevMessages,
            `${username}: ${message}`,
        ]);
    });

    // Emit a join event to let the server know the user has joined the room
    socket.emit('JOIN', { roomId, username: 'YourUsername' });
};

// Function to send a chat message
export const sendMessage = (roomId, message) => {
    if (message.trim() !== '') {
        socket.emit('SEND_MESSAGE', { roomId, message });
    }
};
