"use client";
import React from "react";
import VideoBackground from "../_global/_VideoPlayer/VideoBackground";

interface props {
  mainVideo: string;
}

export default function VideoSection({ mainVideo }: props) {
  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Video Background */}
      <VideoBackground
        src={mainVideo ?? "/videos/background.mp4"}
        overlayOpacity={0.7}
      />
    </div>
  );
}
