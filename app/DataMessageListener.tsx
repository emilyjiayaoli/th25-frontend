import React, { useEffect, useContext } from "react";
import { RoomEvent, Room } from "livekit-client";
import { RoomContext } from "@livekit/components-react";

export interface DataMessageListenerProps {
  onDataMessage: (message: any, participant: any, kind: any) => void;
}

const DataMessageListener: React.FC<DataMessageListenerProps> = ({ onDataMessage }) => {
  // RoomContext returns the Room instance itself, not { room: Room }
  const room = useContext(RoomContext) as Room | undefined;

  useEffect(() => {
    if (!room) return;

    const handleDataReceived = (payload: Uint8Array, participant: any, kind: any) => {
      try {
        const decoder = new TextDecoder();
        const dataStr = decoder.decode(payload);
        const dataObj = JSON.parse(dataStr);
        onDataMessage(dataObj, participant, kind);
      } catch (error) {
        console.error("Error parsing data message:", error);
      }
    };

    room.on(RoomEvent.DataReceived, handleDataReceived);
    return () => {
      room.off(RoomEvent.DataReceived, handleDataReceived);
    };
  }, [room, onDataMessage]);

  return null;
};

export default DataMessageListener;
