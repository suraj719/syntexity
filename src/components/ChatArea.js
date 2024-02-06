// File: src/components/ChatArea.js
import React, { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { initSocket } from '../socket';
import ACTIONS from '../Actions';
import './ChatArea.css'; // Create a new CSS file for styling

const ChatArea = ({ roomId }) => {
  const [socket, setSocket] = useState(null);
  const [message, setMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [showChat, setShowChat] = useState(false);
  const username = 'User'; // You can get the username from the user, for now, it's hardcoded

  useEffect(() => {
    const init = async () => {
      // Initialize the socket connection
      const newSocket = await initSocket();
      console.log('Socket connected with the id:', newSocket.id);
      setSocket(newSocket);

      newSocket.on(ACTIONS.RECEIVE_MESSAGE, ({ username, message }) => {
        console.log("The username is:"+username+"Message is"+message)
        setChatMessages((prevMessages) => [...prevMessages, { username, message }]);
      });
    };

    init();
  }, []);

  const sendMessage = () => {
    if (socket && message.trim() !== '') {
        console.log('Sending message:', message);
      socket.emit(ACTIONS.SEND_MESSAGE, { roomId, message });
      setMessage('');
    }
  };

  const toggleChat = () => {
    setShowChat(!showChat);
  };

  return (
    <div className="chat-area-container">
      <div className={`chat-popup ${showChat ? 'show' : 'hide'}`}>
        <div className="chat-header">
          <span className="close" onClick={toggleChat}>&times;</span>
          Chat Area
        </div>
        <div className="chat-body">
          {chatMessages.map(({ username, message }, index) => (
            <div key={index}>
              <strong>{username}:</strong> {message}
            </div>
          ))}
        </div>
        <div className="chat-input">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      </div>
      <div className="chat-toggle" onClick={toggleChat}>
        {showChat ? 'Hid ' : 'Sh '}
      </div>
    </div>
  );
};

export default ChatArea;
