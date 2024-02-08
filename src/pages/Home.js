import React, { useState } from "react";
import { v4 as uuidV4 } from "uuid";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import Stars from "../components/Stars/Stars";

export default function Home() {
  const navigate = useNavigate();

  const [roomId, setRoomId] = useState("");
  const [username, setUsername] = useState("");
  const createNewRoom = (e) => {
    e.preventDefault();
    const id = uuidV4();
    setRoomId(id);
    toast.success("Created a new room");
  };

  const joinRoom = () => {
    if (!roomId || !username) {
      toast.error("ROOM ID & username is required");
      return;
    }

    // Redirect
    navigate(`/editor/${roomId}`, {
      state: {
        username,
      },
    });
  };

  const handleInputEnter = (e) => {
    if (e.code === "Enter") {
      joinRoom();
    }
  };

  return (
    <>
      <div className="bg-black h-[100vh] w-[100vw]">
        <Stars />

        <div className="flex flex-col items-center h-[90vh] justify-center">
          <div className="mb-4">
            <Link to="/">
              <p className="text-6xl text-center font-bold font-halloween text-white">
                SYNTEXITY
              </p>
            </Link>
          </div>
          <div className="bg-gray-800 px-5 py-10 rounded-xl w-[25rem]">
            <form className="flex flex-col items-center">
              <div className="w-full">
                <input
                  type="text"
                  onChange={(e) => setRoomId(e.target.value)}
                  className="rounded-md text-2xl font-halloween outline-none p-2 w-full"
                  placeholder="ROOM ID"
                  value={roomId}
                  onKeyUp={handleInputEnter}
                  required
                />
              </div>
              <div className="mt-4 w-full">
                <input
                  type="text"
                  onChange={(e) => setUsername(e.target.value)}
                  className="rounded-md text-2xl font-halloween outline-none p-2 w-full"
                  placeholder="USERNAME"
                  value={username}
                  onKeyUp={handleInputEnter}
                  required
                />
              </div>
              <div className="w-full">
                <button
                  onClick={joinRoom}
                  className=" w-full border text-4xl font-halloween border-white text-xl hover:bg-gray-600 text-white px-10 py-3 mt-8"
                >
                  Join
                </button>
              </div>
            </form>
            <div className="text-white font-halloween text-2xl text-center mt-4">
              <p>
                Don't have a room ID ?{" "}
                <span
                  onClick={createNewRoom}
                  className="text-red-300 font-bold cursor-pointer"
                >
                  create
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
