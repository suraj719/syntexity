import React from "react";
import Client from "./Client";

export default function Participants({ clients }) {
  return (
    <>
      <div className="flex gap-4 mx-4 flex-wrap justify-evenly my-4 max-w-[15vw]">
        {clients.map((client) => (
          <Client key={client.socketId} username={client.username} />
        ))}
      </div>
    </>
  );
}
