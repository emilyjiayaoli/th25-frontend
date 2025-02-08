// ChatText.tsx
"use client";

import { useContext, useEffect, useState } from "react";
import { RoomContext } from "@livekit/components-react";
import { RoomEvent } from "livekit-client";
import ReactMarkdown from "react-markdown";

const ChatText: React.FC = () => {
  // Access the room instance from the RoomContext
  const room = useContext(RoomContext);
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    if (!room) return;

    // Handler for data messages from other participants
    const handleData = (
      payload: Uint8Array,
      participant: unknown,
      kind: unknown
    ) => {
      console.log("in handleData!")
      const text = new TextDecoder().decode(payload);
      try {
        // Assuming the message is JSON-formatted
        const messageData = JSON.parse(text);
        if (messageData.type === "whiteboard_update") {
          setMessages((prev) => [...prev, messageData.content]);
        }
      } catch (e) {
        console.error("Failed to parse data message:", e);
      }
    };

    room.on(RoomEvent.DataReceived, handleData);
    return () => {
      room.off(RoomEvent.DataReceived, handleData);
    };
  }, [room]);

  return (
    <div className="p-4 bg-gray-100 rounded-md max-h-60 overflow-y-auto">
      {messages.map((msg, idx) => (
        <div key={idx} className="mb-2">
          <ReactMarkdown>{msg}</ReactMarkdown>
        </div>
      ))}
    </div>
  );
};

export default ChatText;
