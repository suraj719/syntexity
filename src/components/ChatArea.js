// ChatArea.js
import React, { useState, useEffect } from 'react';
import { initSocket, initChat, sendMessage } from './socket';

const ChatArea = () => {
    const [message, setMessage] = useState('');
    const [chatMessages, setChatMessages] = useState([]);

    useEffect(() => {
        const socket = initSocket();
        initChat('yourRoomId', setChatMessages);

        return () => {
            socket.off('RECEIVE_MESSAGE');
        };
    }, []);

    const handleSendMessage = () => {
        sendMessage('yourRoomId', message);
        setMessage('');
    };

    return (
        <div>
            <div style={{ height: '200px', overflowY: 'scroll' }}>
                {chatMessages.map((chatMessage, index) => (
                    <div key={index}>{chatMessage}</div>
                ))}
            </div>
            <input
                type="text"
                placeholder="Type your message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
            />
            <button onClick={handleSendMessage}>Send</button>
        </div>
    );
};

export default ChatArea;
