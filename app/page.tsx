"use client";

import { useState } from "react";
import Canvas from "./Canvas";
import Info from "./Info";
import Tutor from "./Tutor";

export default function Page() {
  const [isWebcam, setIsWebcam] = useState(false);

  return (
    <div className="flex h-screen w-screen">
      <div className="w-3/5 flex flex-col">
        <div className="flex-grow-[3]">
          <Canvas />
        </div>
        {/* Fix: Restrict Info Height */}
        <div className="h-1/4 max-h-[200px]">
        <Info isWebcam={isWebcam} setIsWebcam={setIsWebcam} />
        </div>
      </div>

      {/* Right Half - Tutor */}
      <div className="w-2/5">
        <Tutor isWebcam={isWebcam} setIsWebcam={setIsWebcam} />
      </div>
    </div>
  );
}
