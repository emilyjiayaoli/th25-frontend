"use client";

import { useState } from "react";
import Canvas from "../components/Canvas";
import Info from "./Info";
import Tutor from "../components/Tutor";
import Banner from "../components/Banner";

export default function Page() {
  const [isWebcam, setIsWebcam] = useState(false);

  return (
    <div className="h-screen w-screen">
      <div className="h-[4vh]">
        <Banner />
      </div>
      <div className="flex">
        <div className="w-3/5 flex flex-col">
          <div className="pb-2 pl-2 h-[83vh]">
            <Canvas />
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
