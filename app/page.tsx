"use client";

import { useState, useRef } from "react";
import Canvas from "../components/Canvas";
import Info from "./Info";
import Tutor from "../components/Tutor";
import Banner from "../components/Banner";
import Webcam from "react-webcam";

export default function Page() {
  const [isWebcam, setIsWebcam] = useState(false);
  const webcamRef = useRef<Webcam>(null);

  // Video constraints (Front camera)
  const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: "user",
  };

  return (
    <div className="h-screen w-screen bg-[#FDFCFD]">
      <div className="h-[4vh]">
        <Banner />
      </div>
      <div className="flex">
        <div className="w-3/5 flex flex-col">
          <div className="pb-2 pl-2 h-[83vh]">
            {isWebcam ? (
              <div className="w-full h-full bg-black rounded-md overflow-hidden flex items-center justify-center">
                <Webcam
                  ref={webcamRef}
                  videoConstraints={videoConstraints}
                  audio={false}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <Canvas />
            )}
          </div>
          <div className="h-[13vh]">
            <Info isWebcam={isWebcam} setIsWebcam={setIsWebcam} />
          </div>
        </div>

        <div className="w-2/5 flex">
          <Tutor isWebcam={isWebcam} setIsWebcam={setIsWebcam} />
        </div>
      </div>
    </div>
  );
}
