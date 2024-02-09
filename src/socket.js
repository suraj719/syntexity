// socket.js
import { io } from "socket.io-client";
const options = {
  withCredentials: true,
  "force new connection": true,
  reconnectionAttempt: Infinity,
  timeout: 1000,
  transports: ["websocket"],
};
const socket = io(process.env.REACT_APP_BACKEND_URL, options);

const sendKeepAlive = () => {
  socket.emit("keep-alive"); // Adjust the event name as per your server-side implementation
};

setInterval(sendKeepAlive, 30000); // Send keep-alive message every 30 seconds

socket.on("connect", () => {
  console.log("Socket connected with the id:", socket.id);
});

socket.on("disconnect", (reason) => {
  console.log("Socket disconnected with reason:", reason);
});

socket.on("error", (error) => {
  console.error("Socket encountered error:", error);
});

export const initSocket = () => {
  return socket;
};

// export const initSocket = async () => {
//   return socket;
//   //   export const initSocket = () => {
//   //     return socket;
//   // };
//   // try {
//   //   const socket = io(`${process.env.REACT_APP_BACKEND_URL}`, options);
//   //   await socket.connect();
//   //   console.log('Socket connected with the id:', socket.id);
//   //   return socket;
//   // } catch (error) {
//   //   console.error('Error connecting to socket:', error.message);
//   //   throw error;
//   // }
// };
