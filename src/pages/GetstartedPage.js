// import React from "react";
import { Link } from "react-router-dom";
import React from "react";
import Stars from "../components/Stars/Stars";
import Typewriter from "typewriter-effect";
import ParticlesComponent from "../components/ParticlesComponent";
import '../components/ParticlesComponent.css'

export default function GetstartedPage() {
  return (
    <>
      <div className="w-[100vw] h-[100vh]">
        <ParticlesComponent id='particles'/>
        <div className="flex flex-col items-center h-[90vh] justify-center">
          <p className="text-8xl font-bold font-halloween text-white">
            SYNTEXITY
          </p>
          <div className="text-white font-halloween text-2xl">
          <Typewriter
          options = {{
            strings:"A collaborative code editor",
            autoStart: true,
            loop:true
          }}
           />
           </div>
          {/* <p className="text-3xl font-halloween text-white">
            A collaborative code-editor
          </p> */}
          <Link to="/auth">
            <button className="border border-white font-bold text-xl hover:bg-gray-800 text-white px-8 py-3 mt-8">
              Get started
            </button>
          </Link>
        </div>
      </div>
    </>
  );
}
