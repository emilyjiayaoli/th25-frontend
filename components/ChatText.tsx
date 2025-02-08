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
          setMessages(prevMessages => {
            const updatedMessages = [...prevMessages, messageData.content];
            return updatedMessages;
          });
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
    // slightly less than 85vh because of margin 
    <div className="w-full h-[83.5vh] m-2 p-4 border-2 border-tl-blue rounded-lg overflow-y-auto flex flex-col">
      {messages.length === 0 ? (
        <div className="flex-grow flex items-center justify-center text-gray-400 italic">
          When you chat, the Tutor's messages will appear here
        </div>
      ) : (
        messages.map((msg, idx) => (
          <div key={idx} className="mb-4 text-[#5F6269]">
            <ReactMarkdown className="prose prose-blue max-w-none">
              {msg}
            </ReactMarkdown>
          </div>
        ))
      )}
    </div>
  );
};

export default ChatText;
