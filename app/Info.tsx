"use client";

import React, { useState, useEffect } from "react";

interface InfoProps {
  isWebcam: boolean;
  setIsWebcam: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Info({ isWebcam, setIsWebcam }: InfoProps) {
  const [files, setFiles] = useState<string[]>([]);

  useEffect(() => {
    async function fetchFiles() {
      try {
        const response = await fetch('http://127.0.0.1:5000/files');
        if (response.ok) {
          const filesList = await response.json();
          setFiles(filesList);
        } else {
          console.error('Failed to fetch files:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching files:', error);
      }
    }

    fetchFiles();
  }, []);

  return (
    <div className="h-full p-4 flex flex-col justify-center relative">
      <div className="absolute top-2 right-2 flex items-center space-x-2 z-50 pointer-events-auto">
        <span className="text-sm font-medium text-gray-700">
          {isWebcam ? "Webcam On" : "Webcam Off"}
        </span>
        <button
          onClick={() => setIsWebcam((prev) => !prev)}
          className={`relative w-12 h-6 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 ${isWebcam ? "bg-green-500" : "bg-gray-400"
            }`}
        >
          <span
            className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${isWebcam ? "translate-x-6" : "translate-x-0"
              }`}
          />
        </button>
      </div>

      <div className="flex space-x-2">
        {files.map((file, index) => (
          <div key={index} className="flex-shrink-0">
            <img
              src={`http://127.0.0.1:5000/uploads/${file}`}
              alt={file}
              className="w-24 h-24 object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
}




