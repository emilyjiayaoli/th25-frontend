"use client";

import Canvas from "./Canvas";
import Info from "./Info";
import Tutor from "./Tutor";

export default function Page() {
  return (
    <div className="flex h-screen w-screen">
      <div className="w-3/5 flex flex-col">
        <div className="flex-grow-[3]">
          <Canvas />
        </div>
        <div className="flex-grow-[1]">
          <Info />
        </div>
      </div>

      {/* Right Half - Tutor */}
      <div className="w-2/5">
        <Tutor />
      </div>
    </div>
  );
}