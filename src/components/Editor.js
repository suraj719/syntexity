import React, { useEffect, useRef, useState } from 'react';
import { language, cmtheme } from '../../src/atoms';
import { useRecoilValue } from 'recoil';
import ACTIONS from '../Actions';
import ChatArea from './ChatArea';
import Codemirror from 'codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/addon/edit/closetag';
import 'codemirror/addon/edit/closebrackets';
import 'codemirror/addon/scroll/simplescrollbars.css';

const Editor = ({ socketRef, roomId, onCodeChange }) => {
  const editorRef = useRef(null);
  const [message, setMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [showChat, setShowChat] = useState(false);
  const lang = useRecoilValue(language);
  const editorTheme = useRecoilValue(cmtheme);
  
  useEffect(() => {
    async function init() {
      editorRef.current = Codemirror.fromTextArea(
        document.getElementById('realtimeEditor'),
        {
          mode: { name: lang },
          theme: editorTheme,
          autoCloseTags: true,
          autoCloseBrackets: true,
          lineNumbers: true,
        }
      );

      editorRef.current.on('change', (instance, changes) => {
        const { origin } = changes;
        const code = instance.getValue();
        onCodeChange(code);
        if (origin !== 'setValue') {
          socketRef.current.emit(ACTIONS.CODE_CHANGE, {
            roomId,
            code,
          });
        }
      });
    }

    init();
  }, [lang]);

  useEffect(() => {
    if (socketRef.current) {
      socketRef.current.on(ACTIONS.RECEIVE_MESSAGE, ({ username, message }) => {
        setChatMessages((prevMessages) => [...prevMessages, { username, message }]);
      });
    }

    return () => {
      socketRef.current.off(ACTIONS.RECEIVE_MESSAGE);
    };
  }, [socketRef.current]);

  useEffect(() => {
    if (socketRef.current) {
      socketRef.current.on(ACTIONS.CODE_CHANGE, ({ code }) => {
        if (code !== null) {
          editorRef.current.setValue(code);
        }
      });
    }

    return () => {
      socketRef.current.off(ACTIONS.CODE_CHANGE);
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

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const fileContent = e.target.result;
      editorRef.current.setValue(fileContent);
    };

    reader.readAsText(file);
  };

  return (
    <div>
      <input type="file" onChange={handleFileUpload} />
      <textarea id="realtimeEditor"></textarea>
      <div className={`chat-popup ${showChat ? 'show' : ''}`}>
        {/* Chat UI */}
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

export default Editor;
