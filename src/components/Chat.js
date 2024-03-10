import React, { useState, useEffect } from "react";
import ACTIONS from "../Actions";
import "./ChatArea.css";

export default function Chat({ socketRef, roomId, currentUsername }) {
  const [message, setMessage] = useState("");
  const [showChat, setShowChat] = useState(false);

  const [chatMessages, setChatMessages] = useState([]);
  useEffect(() => {
    if (socketRef.current) {
      socketRef.current.on(ACTIONS.RECEIVE_MESSAGE, ({ username, message }) => {
        setChatMessages((prevMessages) => [
          ...prevMessages,
          { username, message },
        ]);
      });
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.off(ACTIONS.RECEIVE_MESSAGE);
      }
    };
  }, [socketRef.current]);

  const sendMessage = () => {
    if (socketRef.current && message.trim() !== "") {
      socketRef.current.emit(ACTIONS.SEND_MESSAGE, { roomId, message });
      setMessage("");
    }
  };

  const toggleChat = () => {
    setShowChat(!showChat);
  };
  return (
    <>
      <div className="flex flex-col h-full">
        <div className="chat-bdy">
          {/* {chatMessages.map(({ username, message }, index) => (
            
          ))} */}
          {chatMessages.map(({ username, message }, index) => {
            return (
              <div key={index + username}>
                {currentUsername === username ? (
                  <div className="m-1 flex gap-1 justify-end items-end text-white">
                    <p>{username}</p>
                    <p className="messageBox backgroundBlue"
                    style={{
                        wordBreak:"break-word"
                    }}
                    >{message}</p>
                  </div>
                ) : (
                  <div className="m-1 flexgap-1 justify- items-end text-white">
                    <div className="messageBox backgroundLight" style={{
                        wordBreak:"break-word"
                    }}>{message}</div>
                    
                    <p>{username}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <div className="ps-2 pb-2 flex items-center text-white mt-auto">
          <input
            type="text"
            value={message}
            className="h-full  py-3 px-1 outline-none rounded-l-lg text-black"
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
          />
          <button
            className="px-3 border py-2 rounded-r-lg"
            onClick={sendMessage}
          >
            Send
          </button>
          <a
            href="https://syntexity-ar.vercel.app/"
            rel="noreferrer"
            target="_blank"
            className="text-white"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z"
              />
            </svg>
          </a>
        </div>
      </div>
      {/* <div className="chat-area-container">
        <div className={`chat-popup ${showChat ? "show" : ""}`}>
          <div className="chat-header">
            <span className="close" onClick={toggleChat}>
              &times;
            </span>
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
          {showChat ? "Hide Chat" : "Show Chat"}
        </div>
      </div> */}
    </>
  );
}