import React, { useEffect, useRef, useState } from "react";
import { language, cmtheme } from "../../src/atoms";
import { useRecoilValue } from "recoil";
import ACTIONS from "../Actions";
import ChatArea from "./ChatArea";
// CODE MIRROR
import Codemirror from "codemirror";
import "codemirror/lib/codemirror.css";

// Import themes and modes as needed
import "./EditorAddon"

const languageFileExtensions = {
  python: "py",
  cpp: "cpp",
  c: "c",
  csharp: "cs",
  dart: "dart",
  go: "go",
  css: "css",
  html: "html",
  javascript: "js",
  json: "json",
  markdown: "md",
  php: "php",
  jsx: "jsx",
  r: "r",
  rust: "rs",
  ruby: "rb",
  sql: "sql",
  xml: "xml",
  swift: "swift",
  yaml: "yaml",
  // Add more languages and their corresponding file extensions as needed
};

const Editor = ({ socketRef, roomId, onCodeChange, isLocked }) => {
  const editorRef = useRef(null);
  const [message, setMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [showChat, setShowChat] = useState(false);
  const lang = useRecoilValue(language);
  const editorTheme = useRecoilValue(cmtheme);
  const [code, setCode] = useState("");

  useEffect(() => {
    async function init() {
      if (editorRef.current) {
        editorRef.current.toTextArea();
      }
      editorRef.current = Codemirror.fromTextArea(
        document.getElementById("realtimeEditor"),
        {
          mode: { name: lang },
          theme: editorTheme,
          autoCloseTags: true,
          autoCloseBrackets: true,
          lineNumbers: true,
          extraKeys: { "Ctrl-Space": "autocomplete" },
          autocomplete: true,
          readOnly: isLocked ? "nocursor" : false,
        }
      );

      editorRef.current.on("change", (instance, changes) => {
        const { origin } = changes;
        const newCode = instance.getValue();
        setCode(newCode);
        onCodeChange(newCode);
        if (origin !== "setValue") {
          socketRef.current.emit(ACTIONS.CODE_CHANGE, {
            roomId,
            code: newCode,
          });
        }
      });
    }

    init();
  }, [lang, isLocked]); // Make sure isLocked is included in the dependency array
  

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
          setCode(code);
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
      const code = editorRef.current.getValue();
      // Emit CODE_CHANGE to update other users
      socketRef.current.emit(ACTIONS.CODE_CHANGE, {
        roomId,
        code: fileContent,
      });
      // Update the local editor
      editorRef.current.setValue(fileContent);
      setCode(fileContent);
    };

    reader.readAsText(file);
  };

  const handleSaveCode = () => {
    const element = document.createElement("a");
    const file = new Blob([code], { type: "text/plain" });
  
    const fileExtension = languageFileExtensions[lang] || "txt";
  
    const fileName = `code.${fileExtension}`;
    element.href = URL.createObjectURL(file);
    element.download = fileName;
    document.body.appendChild(element);
    element.click();
  };
  

  return (
    <div>
      <input type="file" onChange={handleFileUpload} />
      <button onClick={handleSaveCode}>Save Code</button>
      <textarea id="realtimeEditor"></textarea>
      <ChatArea socketRef={socketRef} roomId={roomId} />
    </div>
  );
};

export default Editor;


