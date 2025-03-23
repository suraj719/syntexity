import React, { useEffect, useRef, useState } from "react";
import { language, cmtheme } from "../../src/atoms";
import { useRecoilValue } from "recoil";
import ACTIONS from "../Actions";
import ChatArea from "./ChatArea";
// CODE MIRROR
import Codemirror from "codemirror";
import "codemirror/lib/codemirror.css";

// Import themes and modes as needed
import "./EditorAddon";
import "./Cursor.css";

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
};

const Editor = ({
  socketRef,
  roomId,
  onCodeChange,
  isLocked,
  currentUsername,
  clients,
  output,
  userInput,
  setUserInput,
}) => {
  const editorRef = useRef(null);
  const lang = useRecoilValue(language);
  const editorTheme = useRecoilValue(cmtheme);
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const fetchCodeSuggestion = async () => {
    console.log("Fetching code suggestions");
    
    // Prevent multiple simultaneous suggestion requests
    if (isLoading) return;

    try {
      setIsLoading(true);
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/suggest-code`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          codeSnippet: code,
          language: lang,
        }),
      });

      const data = await response.json();
      
      if (data.suggestion) {
        // Append the suggestion to the existing code
        const newCode = code + '\n' + data.suggestion;
        
        editorRef.current.setValue(newCode);
        setCode(newCode);
        
        socketRef.current.emit(ACTIONS.CODE_CHANGE, {
          roomId,
          code: newCode,
        });
      }
    } catch (error) {
      console.error("Error fetching code suggestion:", error);
      // Optionally show an error toast or message to the user
    } finally {
      setIsLoading(false);
    }
  };

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
          autofocus: true,
          dragDrop: true,
          autoCloseTags: true,
          autoCloseBrackets: true,
          lineNumbers: true,
          extraKeys: { Tab: "autocomplete" },
          autocomplete: true,
          readOnly: isLocked ? "nocursor" : false,
          lineWrapping: true,
          styleActiveLine: true,
          matchBrackets: true,
        }
      );

      // const ydoc = new Y.Doc();
      // const provider = new WebrtcProvider(
      //   roomId,
      //   ydoc
      // );
      // const yText = ydoc.getText("codemirror");
      // const yUndoManager = new Y.UndoManager(yText);

      // new CodemirrorBinding(yText, editorRef.current, provider.awareness, {
      //   yUndoManager,
      // });

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
  }, [lang]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      // More specific event checking
      if (e.altKey && e.key === "s") {
        // Ensure the editor or its wrapper is actually focused
        const activeElement = document.activeElement;
        const editorWrapper = editorRef.current?.getWrapperElement();
        const editorTextArea = editorRef.current?.getTextArea();
  
        if (activeElement === editorTextArea || 
            editorWrapper?.contains(activeElement)) {
          e.preventDefault();
          fetchCodeSuggestion(e);
        }
      }
    };
  
    document.addEventListener("keydown", handleKeyDown);
  
    // Cleanup listener on unmount
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [lang, code, fetchCodeSuggestion]);

  useEffect(() => {
    if (socketRef.current && socketRef.current.connected) {
      socketRef.current.emit(ACTIONS.TOGGLE_EDITOR_LOCK, {
        roomId,
        editorLocked: isLocked,
      });
      socketRef.current.on(
        ACTIONS.TOGGLE_EDITOR_LOCK,
        ({ roomId, editorLocked }) => {
          editorRef.current.setOption(
            "readOnly",
            editorLocked ? "nocursor" : false
          );
        }
      );
    }
  }, [isLocked, socketRef.current]);

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

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const fileContent = e.target.result;
      socketRef.current.emit(ACTIONS.CODE_CHANGE, {
        roomId,
        code: fileContent,
      });
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
    <div className="flex h-[90vh]">
      <div
        className="text-white flex gap-4"
        style={{
          position: "absolute",
          top: "20px",
          right: "15px",
        }}
      >
        <input
          type="file"
          id="upload"
          onChange={handleFileUpload}
          className="hidden"
        />
        <label htmlFor="upload" className="font-bold">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={3.6}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5"
            />
          </svg>
        </label>
        <div onClick={handleSaveCode} className="font-bold">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={3.6}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
            />
          </svg>
        </div>
      </div>
      <div>
        <div className="border-2 rounded-lg p-2 m-2">
          <textarea id="realtimeEditor"></textarea>
        </div>
        <div className="grid grid-cols-2 gap-2 p-2">
        <div className="border-2 rounded-lg p-2 h-[20vh]">
          <p className="text-white font-bold text-xl">Input</p>
          <textarea
            className="w-full h-full bg-gray-800 text-white p-2 rounded"
            value={userInput}
            onChange={(e) => {
              setUserInput(e.target.value);
              //setInput(e.target.value);
            }}
          />
        </div>
        <div className="border-2 rounded-lg p-2 h-[20vh]">
          <p className="text-white font-bold text-xl">Output</p>
          <p className="text-white mt-4">{output}</p>
        </div>
      </div>
        {/* <div className="border-2 rounded-lg h-[20vh] p-2 m-2">
          <p className="text-white font-halloween text-2xl">Output</p>
          <p className="text-white mt-4">{output}</p>
        </div> */}
      </div>
      {/* <div>
        <div className="border-2 rounded-lg p-2 m-2">
          <textarea id="realtimeEditor"></textarea>
        </div>
        <div className="border-2 rounded-lg h-[20vh] p-2 m-2">
  <p className="text-white font-halloween text-2xl">Output</p>
  <div className="mt-2 mb-2">
    <textarea 
      className="w-full bg-gray-800 text-white p-2 rounded"
      placeholder="Enter input for your code here..."
      value={userInput}
      onChange={(e) => setUserInput(e.target.value)}
      rows={2}
    />
  </div>
  <p className="text-white mt-2">{output}</p>
</div>

      </div> */}
      <ChatArea
        socketRef={socketRef}
        roomId={roomId}
        currentUsername={currentUsername}
        clients={clients}
      />
    </div>
  );
};

export default Editor;
