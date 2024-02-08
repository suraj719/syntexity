import React, { useState } from "react";
import axios from "axios";
// import { useSignIn } from "react-auth-kit";
// import useSignIn from "react-auth-kit/hooks/useSignIn";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  //   const signIn = useSignIn();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post("http://localhost:9630/api/login", {
        username: username,
        password: password,
      });

      if (response.data) {
        console.log("success");
      } else {
        console.log("failed login");
      }
    } catch (error) {
      if (error.response) {
        console.error(
          "Request failed with status code:",
          error.response.status
        );
        console.error("Error message:", error.response.data);
      } else if (error.request) {
        console.error("No response received:", error.request);
      } else {
        console.error("Error during request setup:", error.message);
      }
    }
    setIsLoading(false);
  };

  return (
    <form className="flex flex-col items-center" onSubmit={handleLogin}>
      <div className="w-full">
        <input
          type="text"
          onChange={(e) => setUsername(e.target.value)}
          className="rounded-md text-2xl font-halloween outline-none p-2 w-full"
          placeholder="Username"
          required
        />
      </div>
      <div className="mt-4 w-full">
        <input
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          className="rounded-md text-2xl font-halloween outline-none p-2 w-full"
          placeholder="Password"
          required
        />
      </div>
      <div className="w-full">
        {isLoading ? (
          <>
            <button
              type="submit"
              className="w-full py-2 text-white cursor-wait text-4xl font-halloween bg-gray-400 rounded-md text-center
              hover:bg-gray-600
              "
              //   onClick={handleLogin}
              disabled
            >
              Login
            </button>
          </>
        ) : (
          <>
            <button
              //   onClick={handleLogin}
              className=" w-full border text-4xl font-halloween border-white text-xl hover:bg-gray-600 text-white px-10 py-3 mt-8"
            >
              Login
            </button>
          </>
        )}
      </div>
    </form>
  );
}
