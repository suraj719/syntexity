import React, { useState, useRef, useEffect } from "react";
import toast from "react-hot-toast";
import Client from "../components/Client";
import Editor from "../components/Editor";
import { language, cmtheme } from "../../src/atoms";
import { useRecoilState } from "recoil";
import ACTIONS from "../Actions";
import { initSocket } from "../socket";
import Stars from "../components/Stars/Stars";
import {
  useLocation,
  useNavigate,
  Navigate,
  useParams,
} from "react-router-dom";
import axios from "axios";

const EditorPage = () => {
  const [lang, setLang] = useRecoilState(language);
  const [them, setThem] = useRecoilState(cmtheme);

  const [clients, setClients] = useState([]);

  const [isEditorLocked, setEditorLocked] = useState(false);

  const socketRef = useRef(null);
  const codeRef = useRef(null);
  const location = useLocation();
  const { roomId } = useParams();
  const reactNavigator = useNavigate();
  const [output, setOutput] = useState("");
  const [code, setCode] = useState("");
  const [onlineUsersCount, setOnlineUsersCount] = useState(0);
  // console.log(codeRef.current)
  const handleOutput = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5050/execute", {
        clientId: "1a84ac9ae69763aa3e7896e1389c4b5b",
        clientSecret:
          "ac9b8b22a649f702e95d066f35fb2eb3b07613d5f949fde39193d34fbf79b89b",
        language: lang,
        script: code,
      });
      console.log(res);
      setOutput(res.data.output);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    const init = async () => {
      socketRef.current = await initSocket();
      socketRef.current.on("connect_error", (err) => handleErrors(err));
      socketRef.current.on("connect_failed", (err) => handleErrors(err));

      function handleErrors(e) {
        console.log("socket error", e);
        toast.error("Socket connection failed, try again later.");
        reactNavigator("/");
      }
      socketRef.current.emit(ACTIONS.JOIN, {
        roomId,
        username: location.state?.username,
      });

      // Listening for joined event
      socketRef.current.on(
        ACTIONS.JOINED,
        ({ clients, username, socketId }) => {
          if (username !== location.state?.username) {
            toast.success(`${username} joined the room.`);
            console.log(`${username} joined`);
          }
          setClients(clients);
          setOnlineUsersCount(clients.length);
          socketRef.current.emit(ACTIONS.SYNC_CODE, {
            code: codeRef.current,
            socketId,
          });
        }
      );

      // Listening for disconnected
      socketRef.current.on(ACTIONS.DISCONNECTED, ({ socketId, username }) => {
        toast.success(`${username} left the room.`);
        setClients((prev) => {
          return prev.filter((client) => client.socketId !== socketId);
        });
        setOnlineUsersCount((prevCount) => prevCount - 1);
      });
    };
    init();
    return () => {
      socketRef.current.off(ACTIONS.JOINED);
      socketRef.current.off(ACTIONS.DISCONNECTED);
      socketRef.current.disconnect();
    };
  }, []);

  async function copyRoomId() {
    try {
      await navigator.clipboard.writeText(roomId);
      toast.success("Room ID has been copied to your clipboard");
    } catch (err) {
      toast.error("Could not copy the Room ID");
      console.error(err);
    }
  }

  function leaveRoom() {
    reactNavigator("/");
  }

  if (!location.state) {
    return <Navigate to="/" />;
  }

  return (
    <div className="">
      <Stars />
      <div className="flex items-center justify-evenly pt-4 text-white text-2xl">
        <div className="font-halloween mx-2">
          <span className="text-red-400">Online Users:{onlineUsersCount}</span>
        </div>
        <div className="font-halloween">
          <label className="text-green-300">select language:</label>
          <select
            className="h-full ms-4 text-xl bg-black p-2 border text-white"
            value={lang}
            onChange={(e) => {
              setLang(e.target.value);
              window.location.reload();
            }}
          >
            <option value="c">C</option>
            <option value="cpp17">CPP</option>
            <option value="csharp">C#</option>
            <option value="css">CSS</option>
            <option value="dart">Dart</option>
            <option value="go">Go</option>
            <option value="json">JSON</option>
            <option value="markdown">Markdown</option>
            <option value="html">HTML</option>
            <option value="javascript">JavaScript</option>
            <option value="jsx">JSX</option>
            <option value="php">PHP</option>
            <option value="python3">Python</option>
            <option value="r">R</option>
            <option value="rust">Rust</option>
            <option value="ruby">Ruby</option>
            <option value="sql">SQL</option>
            <option value="swift">Swift</option>
            <option value="xml">XML</option>
            <option value="yaml">YAML</option>
          </select>
        </div>
        <div className="font-halloween">
          <label className="text-violet-300">select theme:</label>
          <select
            className="h-full ms-4 text-xl bg-black p-2 border text-white select-halloween"
            value={them}
            onChange={(e) => {
              setThem(e.target.value);
              window.location.reload();
            }}
          >
            <option value="default">default</option>
            <option value="3024-day">3024-day</option>
            <option value="3024-night">3024-night</option>
            <option value="abbott">abbott</option>
            <option value="abcdef">abcdef</option>
            <option value="ambiance">ambiance</option>
            <option value="ayu-dark">ayu-dark</option>
            <option value="ayu-mirage">ayu-mirage</option>
            <option value="base16-dark">base16-dark</option>
            <option value="base16-light">base16-light</option>
            <option value="bespin">bespin</option>
            <option value="blackboard">blackboard</option>
            <option value="cobalt">cobalt</option>
            <option value="colorforth">colorforth</option>
            <option value="darcula">darcula</option>
            <option value="duotone-dark">duotone-dark</option>
            <option value="duotone-light">duotone-light</option>
            <option value="eclipse">eclipse</option>
            <option value="elegant">elegant</option>
            <option value="erlang-dark">erlang-dark</option>
            <option value="gruvbox-dark">gruvbox-dark</option>
            <option value="hopscotch">hopscotch</option>
            <option value="icecoder">icecoder</option>
            <option value="idea">idea</option>
            <option value="isotope">isotope</option>
            <option value="juejin">juejin</option>
            <option value="lesser-dark">lesser-dark</option>
            <option value="liquibyte">liquibyte</option>
            <option value="lucario">lucario</option>
            <option value="material">material</option>
            <option value="material-darker">material-darker</option>
            <option value="material-palenight">material-palenight</option>
            <option value="material-ocean">material-ocean</option>
            <option value="mbo">mbo</option>
            <option value="mdn-like">mdn-like</option>
            <option value="midnight">midnight</option>
            <option value="monokai">monokai</option>
            <option value="moxer">moxer</option>
            <option value="neat">neat</option>
            <option value="neo">neo</option>
            <option value="night">night</option>
            <option value="nord">nord</option>
            <option value="oceanic-next">oceanic-next</option>
            <option value="panda-syntax">panda-syntax</option>
            <option value="paraiso-dark">paraiso-dark</option>
            <option value="paraiso-light">paraiso-light</option>
            <option value="pastel-on-dark">pastel-on-dark</option>
            <option value="railscasts">railscasts</option>
            <option value="rubyblue">rubyblue</option>
            <option value="seti">seti</option>
            <option value="shadowfox">shadowfox</option>
            <option value="solarized">solarized</option>
            <option value="the-matrix">the-matrix</option>
            <option value="tomorrow-night-bright">tomorrow-night-bright</option>
            <option value="tomorrow-night-eighties">
              tomorrow-night-eighties
            </option>
            <option value="ttcn">ttcn</option>
            <option value="twilight">twilight</option>
            <option value="vibrant-ink">vibrant-ink</option>
            <option value="xq-dark">xq-dark</option>
            <option value="xq-light">xq-light</option>
            <option value="yeti">yeti</option>
            <option value="yonce">yonce</option>
            <option value="zenburn">zenburn</option>
          </select>
        </div>

        <div>
          <button
            onClick={() => setEditorLocked(!isEditorLocked)}
            className="border px-8 py-1 font-halloween text-red-300"
          >
            {isEditorLocked ? "Unlock Editor" : "lock Editor"}
          </button>
        </div>
        <div>
          <button
            onClick={leaveRoom}
            className="text-red-400 border px-8 py-1 font-halloween"
          >
            Leave
          </button>
        </div>
        <div>
          <button
            onClick={leaveRoom}
            className="text-green-400 border px-8 py-1 font-halloween"
          >
            Analysis
          </button>
        </div>
        <div>
          <button onClick={handleOutput} className="font-halloween">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={3.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z"
              />
            </svg>
          </button>
        </div>
        <div>
          <button onClick={copyRoomId} className="font-halloween">
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
                d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z"
              />
            </svg>
          </button>
        </div>
        <div className="w-[50px]"></div>
      </div>

      <div className="editorWrap">
        <Editor
          socketRef={socketRef}
          roomId={roomId}
          onCodeChange={(newcode) => {
            codeRef.current = newcode;
            setCode(newcode);
          }}
          isLocked={isEditorLocked}
          currentUsername={location.state?.username}
          clients={clients}
          output={output}
        />
      </div>
    </div>
  );
};

export default EditorPage;
