import React from "react";
import Avatar from "react-avatar";

const Client = ({ username }) => {
  return (
    <div className="flex flex-col items-center">
      <Avatar name={username} size={50} round="14px" />
      {/* <br /> */}
      <span className="text-white">{username}</span>
    </div>
  );
};

export default Client;
