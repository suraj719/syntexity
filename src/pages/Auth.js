import React, { useState } from "react";
import { Link } from "react-router-dom";
import Login from "../components/Auth/Login";
import Register from "../components/Auth/Register";
import Stars from "../components/Stars/Stars";
import ParticlesComponent from "../components/ParticlesComponent";
import '../components/ParticlesComponent.css'
export default function Auth() {
  const [showlogin, setShowLogin] = useState(true);
  return (
    <div className=" h-[100vh] w-[100vw]">
      {/* <Stars /> */}
      <ParticlesComponent id='particles' />

      <div className="flex flex-col items-center h-[90vh] justify-center">
        <div className="mb-4">
          <Link to="/">
            <p className="text-6xl text-center font-bold font-halloween text-white">
              SYNTEXITY
            </p>
          </Link>
        </div>
        <div className="bg-gray-800 px-5 py-10 rounded-xl w-[25rem]">
          {/* <p className="my-8 text-center font-halloween text-white text-6xl">
            {showlogin ? "Login" : "Register"}
          </p> */}
          {showlogin ? <Login /> : <Register />}
          <div className="text-white font-halloween text-2xl text-center mt-4">
            {showlogin ? (
              <>
                <p>
                  Don't have an account ?{" "}
                  <span
                    onClick={() => setShowLogin(!showlogin)}
                    className="text-red-300 font-bold cursor-pointer"
                  >
                    Register
                  </span>
                </p>
              </>
            ) : (
              <>
                <p>
                  Already have an account ?{" "}
                  <span
                    onClick={() => setShowLogin(!showlogin)}
                    className="text-red-300 font-bold cursor-pointer"
                  >
                    Login
                  </span>
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
