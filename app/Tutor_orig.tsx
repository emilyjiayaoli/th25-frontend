"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  LiveKitRoom,
  useVoiceAssistant,
  BarVisualizer,
  RoomAudioRenderer,
  VoiceAssistantControlBar,
  AgentState,
  DisconnectButton,
} from "@livekit/components-react";
import { useCallback, useEffect, useState } from "react";
import { MediaDeviceFailure } from "livekit-client";
import type { ConnectionDetails } from "./api/connection-details/route";
import { NoAgentNotification } from "@/components/NoAgentNotification";
import { CloseIcon } from "@/components/CloseIcon";
import { useKrispNoiseFilter } from "@livekit/components-react/krisp";

// Custom Components
import DataMessageListener from "./DataMessageListener";
import Canvas from "./Canvas"; // Import your Canvas (Tldraw) component

export default function Tutor() {
  const [connectionDetails, updateConnectionDetails] = useState<ConnectionDetails | undefined>(
    undefined
  );
  const [agentState, setAgentState] = useState<AgentState>("disconnected");
  const [canvasText, setCanvasText] = useState<string>("");

  console.log("canvasText", canvasText);

  const onConnectButtonClicked = useCallback(async () => {
    const url = new URL(
      process.env.NEXT_PUBLIC_CONN_DETAILS_ENDPOINT ?? "/api/connection-details",
      window.location.origin
    );
    const response = await fetch(url.toString());
    const connectionDetailsData = await response.json();
    updateConnectionDetails(connectionDetailsData);
  }, []);

  // Handle incoming data messages from LiveKit
  const handleDataMessage = (message: any, participant: any, kind: any) => {
    if (message?.type === "whiteboard_update") {
      setCanvasText(message.content);
    }
  };

  return (
    <main
      data-lk-theme="default"
      className="h-full w-full grid content-center bg-[var(--lk-bg)]"
    >
      <LiveKitRoom
        token={connectionDetails?.participantToken}
        serverUrl={connectionDetails?.serverUrl}
        connect={connectionDetails !== undefined}
        audio={true}
        video={false}
        onMediaDeviceFailure={onDeviceFailure}
        onDisconnected={() => {
          updateConnectionDetails(undefined);
        }}
        className="grid grid-rows-[2fr_1fr] items-center"
      >
        {/* Listen for AI messages and update Canvas */}
        <DataMessageListener onDataMessage={handleDataMessage} />

        {/* Render the Canvas (Tldraw Whiteboard) */}
        {/* <Canvas text={canvasText} /> */}

        {/* Other UI Components */}
        <SimpleVoiceAssistant onStateChange={setAgentState} />
        <ControlBar onConnectButtonClicked={onConnectButtonClicked} agentState={agentState} />
        <RoomAudioRenderer />
        <NoAgentNotification state={agentState} />
      </LiveKitRoom>
    </main>
  );
}

interface SimpleVoiceAssistantProps {
  onStateChange: (state: AgentState) => void;
}

function SimpleVoiceAssistant({ onStateChange }: SimpleVoiceAssistantProps) {
  const { state, audioTrack } = useVoiceAssistant();
  useEffect(() => {
    onStateChange(state);
  }, [onStateChange, state]);
  return (
    <div className="h-[300px] max-w-[90vw] mx-auto">
      <BarVisualizer
        state={state}
        barCount={5}
        trackRef={audioTrack}
        className="agent-visualizer"
        options={{ minHeight: 24 }}
      />
    </div>
  );
}

interface ControlBarProps {
  onConnectButtonClicked: () => void;
  agentState: AgentState;
}

function ControlBar({ onConnectButtonClicked, agentState }: ControlBarProps) {
  const krisp = useKrispNoiseFilter();
  useEffect(() => {
    krisp.setNoiseFilterEnabled(true);
  }, [krisp]);

  return (
    <div className="relative h-[100px]">
      <AnimatePresence>
        {agentState === "disconnected" && (
          <motion.button
            initial={{ opacity: 0, top: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, top: "-10px" }}
            transition={{ duration: 1, ease: [0.09, 1.04, 0.245, 1.055] }}
            className="uppercase absolute left-1/2 -translate-x-1/2 px-4 py-2 bg-white text-black rounded-md"
            onClick={onConnectButtonClicked}
          >
            Start a conversation
          </motion.button>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {agentState !== "disconnected" && agentState !== "connecting" && (
          <motion.div
            initial={{ opacity: 0, top: "10px" }}
            animate={{ opacity: 1, top: 0 }}
            exit={{ opacity: 0, top: "-10px" }}
            transition={{ duration: 0.4, ease: [0.09, 1.04, 0.245, 1.055] }}
            className="flex h-8 absolute left-1/2 -translate-x-1/2 justify-center"
          >
            <VoiceAssistantControlBar controls={{ leave: false }} />
            <DisconnectButton>
              <CloseIcon />
            </DisconnectButton>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function onDeviceFailure(error?: MediaDeviceFailure): void {
  console.error(error);
  alert(
    "Error acquiring camera or microphone permissions. Please make sure you grant the necessary permissions in your browser and reload the tab"
  );
}
