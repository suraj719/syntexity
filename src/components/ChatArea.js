// chatarea.js
import React, { useEffect, useState } from 'react';
// import { useRecoilValue } from 'recoil';
import ACTIONS from '../Actions';
import './ChatArea.css';

const ChatArea = ({ socketRef, roomId }) => {
  const [message, setMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    if (socketRef.current) {
      socketRef.current.on(ACTIONS.RECEIVE_MESSAGE, ({ username, message }) => {
        setChatMessages((prevMessages) => [...prevMessages, { username, message }]);
      });
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.off(ACTIONS.RECEIVE_MESSAGE);
      }
    };
  }, [socketRef.current]);

  const sendMessage = () => {
    if (socketRef.current && message.trim() !== '') {
      socketRef.current.emit(ACTIONS.SEND_MESSAGE, { roomId, message });
      setMessage('');
    }
  };

  const toggleChat = () => {
    setShowChat(!showChat);
  };

  return (
    <div className="chat-area-container">
      <div className={`chat-popup ${showChat ? 'show' : ''}`}>
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
        {showChat ? 'Hide Chat' : 'Show Chat'}
      </div>
    </div>
  );
};

export default ChatArea;
