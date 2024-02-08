import React from "react";
import { Link } from "react-router-dom";
import Stars from "../components/Stars/Stars";

export default function HomePage() {
  return (
    <>
      <div className="bg-black w-[100vw] h-[100vh]">
        <Stars />
        <div className="flex flex-col items-center h-[90vh] justify-center">
          <p className="text-8xl font-bold font-halloween text-white">
            SYNTEXITY
          </p>
          <p className="text-3xl font-halloween text-white">
            A collaborative code-editor
          </p>
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
