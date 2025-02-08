"use client";

import { useState } from "react";
import Canvas from "../components/Canvas";
import Info from "./Info";
import Tutor from "../components/Tutor";

export default function Page() {
  const [isWebcam, setIsWebcam] = useState(false);

  return (
    <div className="flex h-screen w-screen">
      <div className="w-3/5 flex flex-col">
        <div className="py-2 pl-2 h-[85vh]">
          <Canvas />
        </div>
        {/* Fix: Restrict Info Height */}
        <div className="h-[15vh]">
          <Info isWebcam={isWebcam} setIsWebcam={setIsWebcam} />
        </div>
      </div>

      {/* Right Half - Tutor */}
      <div className="w-2/5 flex">
        <Tutor isWebcam={isWebcam} setIsWebcam={setIsWebcam} />
      </div>
    </div>
  );
}
