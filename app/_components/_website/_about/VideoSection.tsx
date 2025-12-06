"use client";
import React from "react";
import { motion } from "framer-motion";
import { FaChevronDown } from "react-icons/fa";

interface props {
  mainVideo: string;
}

export default function VideoSection({ mainVideo }: props) {
  // Enhanced YouTube URL detection
  const isYoutubeURL =
    mainVideo &&
    (mainVideo.includes("youtube.com") ||
      mainVideo.includes("youtu.be") ||
      mainVideo.includes("youtube-nocookie.com"));

  // Enhanced video ID extraction
  const getYouTubeVideoId = (url: string): string | null => {
    if (!url) return null;

    if (url.includes("youtu.be/")) {
      const match = url.match(/youtu\.be\/([^&?\s]+)/);
      return match ? match[1].split("?")[0] : null;
    }

    const match = url.match(
      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
    );
    return match ? match[1] : null;
  };

  const videoId = isYoutubeURL ? getYouTubeVideoId(mainVideo) : null;

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0 w-full h-full">
        {!isYoutubeURL || !videoId ? (
          <video
            className="w-full h-full object-cover"
            src={mainVideo ?? "/defaults/default-video.mp4"}
            autoPlay
            loop
            muted
            playsInline
            controls={false}
          />
        ) : (
          <iframe
            width="100%"
            height="100%"
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&modestbranding=1&rel=0&disablekb=1&fs=0&showinfo=0`}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen={false}
            className="w-full h-full pointer-events-none scale-150" // Scale up to hide controls/branding
            style={{ border: "none" }}
          ></iframe>
        )}
      </div>

      {/* Overlay Gradient */}
      <div className="absolute inset-0 bg-linear-to-b from-black/30 via-transparent to-black/60 pointer-events-none" />

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-white flex flex-col items-center gap-2 z-10"
      >
        <span className="text-sm font-light tracking-widest uppercase opacity-80">
          Scroll to Explore
        </span>
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          <FaChevronDown className="text-xl opacity-80" />
        </motion.div>
      </motion.div>
    </div>
  );
}
