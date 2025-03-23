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
import * as d3 from "d3";
import axios from "axios";

const EditorPage = () => {
  const [lang, setLang] = useRecoilState(language);
  const [them, setThem] = useRecoilState(cmtheme);

  const [clients, setClients] = useState([]);

  const [isEditorLocked, setEditorLocked] = useState(false);

  const [userChanges, setUserChanges] = useState([]);
  const [showBarChart, setShowBarChart] = useState(false);

  const socketRef = useRef(null);
  const codeRef = useRef(null);
  const location = useLocation();
  const { roomId } = useParams();
  const reactNavigator = useNavigate();
  const [output, setOutput] = useState("");
  const [code, setCode] = useState("");
  const [onlineUsersCount, setOnlineUsersCount] = useState(0);
  const [showAnalysis, setShowAnalysis] = useState(false); // Define showAnalysis state
  // const toggleAnalysis = () => setShowAnalysis(!showAnalysis); // Define toggleAnalysis function
  // console.log(codeRef.current)
  // Add this with your other state declarations
const [userInput, setUserInput] = useState("");

// Update the handleOutput function
const handleOutput = async (e) => {
  e.preventDefault();
  try {
    setOutput("Executing code..."); // Feedback to user that execution is in progress
    const res = await axios.post(
      `${process.env.REACT_APP_BACKEND_URL}/execute`,
      {
        clientId: process.env.REACT_APP_clientId,
        clientSecret: process.env.REACT_APP_clientSecret,
        language: lang,
        script: code,
        stdin: userInput, // Add user input
      }
    );
    console.log(res);
    setOutput(res.data.output);
  } catch (error) {
    console.log(error);
    setOutput("Error executing code: " + (error.response?.data?.error || error.message));
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

      // Listening for user changes
      socketRef.current.on(ACTIONS.USER_CHANGES, (changesData) => {
        console.log(changesData);
        updateUserChanges(changesData);
      });

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
  useEffect(() => {
    const handleKeyDown = (event) => {
      // Check if Ctrl + L is pressed
      if (event.ctrlKey && event.key === "l") {
        // Find the Lock Editor button
        const lockEditorButton = document.getElementById("lock-editor-button");
        // Trigger click event on the Lock Editor button
        lockEditorButton.click();
        event.preventDefault(); // Prevent default browser behavior
      }
    };

    // Add event listener when component mounts
    document.addEventListener("keydown", handleKeyDown);

    // Remove event listener when component unmounts
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);
  useEffect(() => {
    const handleKeyDown = (event) => {
      // Check if Ctrl + Q is pressed
      if (event.ctrlKey && event.key === "q") {
        // Find the Leave button
        const leaveButton = document.querySelector(
          ".font-halloween.text-red-400"
        );
        // Trigger click event on the Leave button
        leaveButton.click();
        event.preventDefault(); // Prevent default browser behavior
      }
    };

    // Add event listener when component mounts
    document.addEventListener("keydown", handleKeyDown);

    // Remove event listener when component unmounts
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);
  useEffect(() => {
    const handleKeyDown = (event) => {
      // Check if Ctrl + E is pressed
      if (event.ctrlKey && event.key === "e") {
        // Find the Analysis button
        const analysisButton = document.getElementById("analysis-button");
        // Trigger click event on the Analysis button
        analysisButton.click();
        event.preventDefault(); // Prevent default browser behavior
      }
    };

    // Add event listener when component mounts
    document.addEventListener("keydown", handleKeyDown);

    // Remove event listener when component unmounts
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);
  useEffect(() => {
    const handleKeyDown = (event) => {
      // Check if Ctrl + J is pressed
      if (event.ctrlKey && event.key === "j") {
        // Find the Copy Room ID button
        const copyRoomIdButton = document.getElementById("copy-room-id-button");
        // Trigger click event on the Copy Room ID button
        copyRoomIdButton.click();
        event.preventDefault(); // Prevent default browser behavior
      }
    };

    // Add event listener when component mounts
    document.addEventListener("keydown", handleKeyDown);

    // Remove event listener when component unmounts
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);
  useEffect(() => {
    const handleKeyDown = (event) => {
      // Check if Ctrl + R is pressed
      if (event.ctrlKey && event.key === "r") {
        // Find the Output button
        const outputButton = document.getElementById("output-button");
        // Trigger click event on the Output button
        outputButton.click();
        event.preventDefault(); // Prevent default browser behavior
      }
    };

    // Add event listener when component mounts
    document.addEventListener("keydown", handleKeyDown);

    // Remove event listener when component unmounts
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
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

  const toggleAnalysis = () => {
    setShowBarChart(!showBarChart);
    // setShowBarChart(!showBarChart);
    if (!showBarChart) {
      console.log("graph created");
      createBarChart();
    } else {
      console.log("new d3");
      d3.select("#bar-chart-container").selectAll("*").remove(); // Remove existing chart
    }
    // createBarChart();
  };

  // Function to update user changes userChanges
  const updateUserChanges = (changesData) => {
    setUserChanges(changesData);
  };

  // D3.js Bar Chart setup
  const createBarChart = () => {
    console.log("Creating bar chart");
    const margin = { top: 100, right: 50, bottom: 80, left: 50 };
    const width = 600 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    // Append SVG to the container
    const svg = d3
      .select("#bar-chart-container")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Define scales
    const x = d3.scaleBand().rangeRound([0, width]).padding(0.1);
    const y = d3.scaleLinear().rangeRound([height, 0]);

    // Define axes
    const xAxis = d3.axisBottom().scale(x);
    const yAxis = d3.axisLeft().scale(y).ticks(10);
    // Set domain of scales
    x.domain(Object.keys(userChanges));
    y.domain([0, d3.max(Object.values(userChanges))]);

    // Append x-axis
    svg
      .append("g")
      .attr("class", "x-axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
      .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", ".15em")
      .attr("transform", "rotate(-45)");

    // Append y-axis
    svg.append("g").attr("class", "y-axis").call(yAxis);

    // Append bars
    svg
      .selectAll(".bar")
      .data(Object.entries(userChanges))
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", (d) => x(d[0]))
      .attr("y", (d) => y(d[1]))
      .attr("width", x.bandwidth())
      .attr("height", (d) => height - y(d[1]));
    // Append text labels
    svg
      .selectAll(".text")
      .data(Object.entries(userChanges))
      .enter()
      .append("text")
      .attr("class", "text")
      .attr("x", (d) => x(d[0]) + x.bandwidth() / 2)
      .attr("y", (d) => y(d[1]) - 5)
      .attr("text-anchor", "middle")
      .text((d) => d[1]);
    console.log("true");
  };

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
          <span className="text-red-400">Users:{onlineUsersCount}</span>
        </div>
        <div className="font-halloween">
          <label className="text-green-300">Language:</label>
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
          <label className="text-violet-300">Themes:</label>
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
            id="lock-editor-button" // Add id attribute here
            onClick={() => setEditorLocked(!isEditorLocked)}
            className="border px-8 py-1 font-halloween text-red-300"
          >
            {isEditorLocked ? "Unlock Editor" : "Lock Editor"}
          </button>
        </div>
        <div>
          <button
            id="analysis-button" // Add id attribute here
            onClick={toggleAnalysis}
            className="border text-green-400 px-8 py-1 font-halloween"
          >
            Analysis
            {/*showBarChart ? "hide" : "show"*/}
          </button>
        </div>
        <div>
          <button
            id="leave-room-button" // Add id attribute here
            onClick={leaveRoom}
            className="text-red-400 border px-8 py-1 font-halloween"
          >
            Leave
          </button>
        </div>
        <div>
          <div>
            <button
              id="output-button" // Add id attribute here
              onClick={handleOutput}
              className="font-halloween"
            >
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
        </div>
        {/* <div id="bar-chart-container"></div> */}
        <div>
          <button
            id="copy-room-id-button" // Add id attribute here
            onClick={copyRoomId}
            className="font-halloween"
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
                d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z"
              />
            </svg>
          </button>
        </div>

        <div className="w-[50px]"></div>
      </div>
      <div
        style={{
          zIndex: "10",
          borderRadius: "15px",
          backgroundColor: "white",
          margin: 0,
          position: "absolute",
          top: "50%",
          left: "50%",
          // msTransform: "translate(-50%,-50%)",
          transform: "translate(-50%,-50%)",
        }}
        id="bar-chart-container"
      ></div>
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
          userInput={userInput}
          setUserInput={setUserInput}
        />
      </div>
    </div>
  );
};

export default EditorPage;
