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
import type { ConnectionDetails } from "../app/api/connection-details/route";
import { NoAgentNotification } from "@/components/NoAgentNotification";
import { CloseIcon } from "@/components/CloseIcon";
import { useKrispNoiseFilter } from "@livekit/components-react/krisp";

import ChatText from "./ChatText"

// take in isWebcam and setIsWebcam as props
interface InfoProps {
  isWebcam: boolean;
  setIsWebcam: React.Dispatch<React.SetStateAction<boolean>>;
}

// takes in props for isWebcam and setIsWebcam
export default function Tutor({ isWebcam, setIsWebcam }: InfoProps) {
  const [connectionDetails, updateConnectionDetails] = useState<
    ConnectionDetails | undefined
  >(undefined);
  const [agentState, setAgentState] = useState<AgentState>("disconnected");

  const onConnectButtonClicked = useCallback(async () => {
    // Generate room connection details, including:
    //   - A random Room name
    //   - A random Participant name
    //   - An Access Token to permit the participant to join the room
    //   - The URL of the LiveKit server to connect to
    //
    // In real-world application, you would likely allow the user to specify their
    // own participant name, and possibly to choose from existing rooms to join.

    const url = new URL(
      process.env.NEXT_PUBLIC_CONN_DETAILS_ENDPOINT ??
      "/api/connection-details",
      window.location.origin
    );
    const response = await fetch(url.toString());
    const connectionDetailsData = await response.json();
    updateConnectionDetails(connectionDetailsData);
  }, []);

  return (
    <main className="flex flex-col w-full">
      <LiveKitRoom
        token={connectionDetails?.participantToken}
        serverUrl={connectionDetails?.serverUrl}
        connect={connectionDetails !== undefined}
        audio={true}
        video={false}
        screen={true}
        onMediaDeviceFailure={onDeviceFailure}
        onDisconnected={() => {
          updateConnectionDetails(undefined);
        }}
        className="flex flex-col h-full"
      >
        <div className="flex">
          <ChatText />
        </div>

        <div className="flex-grow flex flex-col">
          {/* the dots */}
          <SimpleVoiceAssistant onStateChange={setAgentState} />
          {/* chat now, mic, and stop chatting buttons */}
          <ControlBar
            onConnectButtonClicked={onConnectButtonClicked}
            agentState={agentState}
          />
          <RoomAudioRenderer />
          <NoAgentNotification state={agentState} />
        </div>

      </LiveKitRoom>
    </main>
  );
}

function SimpleVoiceAssistant(props: {
  onStateChange: (state: AgentState) => void;
}) {
  const { state, audioTrack } = useVoiceAssistant();
  useEffect(() => {
    props.onStateChange(state);
  }, [props, state]);
  return (
    <div className="h-[60px]">
      <BarVisualizer
        state={state}
        barCount={5}
        trackRef={audioTrack}
        className="agent-visualizer"
      />
    </div>
  );
}

function ControlBar(props: {
  onConnectButtonClicked: () => void;
  agentState: AgentState;
}) {
  /**
   * Use Krisp background noise reduction when available.
   * Note: This is only available on Scale plan, see {@link https://livekit.io/pricing | LiveKit Pricing} for more details.
   */
  const krisp = useKrispNoiseFilter();
  useEffect(() => {
    krisp.setNoiseFilterEnabled(true);
  }, []);

  return (
    <div className="flex items-center justify-center">
      {props.agentState === "disconnected" && (
        <button
          className="bg-tl-blue text-white px-3 p-2 rounded-xl"
          onClick={() => props.onConnectButtonClicked()}
        >
          Chat now
        </button>
      )}

      {props.agentState !== "disconnected" &&
        props.agentState !== "connecting" && (
          <div className="flex justify-evenly w-full px-4">
            <VoiceAssistantControlBar controls={{ leave: false }} />
            <DisconnectButton>
              Stop chatting
            </DisconnectButton>
          </div>
        )}
    </div>
  );
}

function onDeviceFailure(error?: MediaDeviceFailure) {
  console.error(error);
  alert(
    "Error acquiring camera or microphone permissions. Please make sure you grant the necessary permissions in your browser and reload the tab"
  );
}
