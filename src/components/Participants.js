import React from "react";
import Client from "./Client";

export default function Participants({ clients }) {
  return (
    <>
      <div className="flex justify-evenly my-4">
        {clients.map((client) => (
          <Client key={client.socketId} username={client.username} />
        ))}
      </div>
    </>
  );
}
