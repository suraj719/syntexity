// socket.js
import { io } from "socket.io-client";

const options = {
  withCredentials: true,
  "force new connection": true,
  reconnectionAttempt: "Infinity",
  timeout: 1000,
  transports: ["websocket"],
};

const socket = io("http://localhost:5050", options);
const sendKeepAlive = () => {
  socket.emit("keep-alive");
};

setInterval(sendKeepAlive, 30000);
// Function to initialize the socket
export const initSocket = () => {
  return socket;
};

// export const initSocket = async () => {
//   const options = {
//     withCredentials: true,
//     'force new connection': true,
//     reconnectionAttempt: Infinity,
//     timeout: 1000,
//     transports: ['websocket'],
//   };

//   try {
//     const socket = io(`${process.env.REACT_APP_BACKEND_URL}`, options);
//     await socket.connect();
//     console.log('Socket connected with the id:', socket.id);
//     return socket;
//   } catch (error) {
//     console.error('Error connecting to socket:', error.message);
//     throw error;
//   }
// };
