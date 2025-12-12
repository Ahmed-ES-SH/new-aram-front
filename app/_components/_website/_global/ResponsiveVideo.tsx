"use client";

import React from "react";

type ResponsiveVideoProps = {
  videoUrl: string;
  aspectRatio?: "16:9" | "4:3" | "1:1" | "21:9";
  className?: string;
};

export default function ResponsiveVideo({
  videoUrl,
  aspectRatio = "16:9",
  className = "",
}: ResponsiveVideoProps) {
  // Map ratios to Tailwind padding classes
  const ratioClass: Record<string, string> = {
    "16:9": "pb-[56.25%]", // 9/16
    "4:3": "pb-[75%]", // 3/4
    "1:1": "pb-[100%]",
    "21:9": "pb-[42.85%]", // 9/21
  };

  const wrapperPadding = ratioClass[aspectRatio] || ratioClass["16:9"];

  // Detect if it's YouTube
  const isYouTube =
    videoUrl.includes("youtube.com") || videoUrl.includes("youtu.be");

  // Get embed link for YouTube
  const convertToEmbed = (url: string) => {
    if (url.includes("watch?v=")) {
      return url.replace("watch?v=", "embed/");
    }
    if (url.includes("youtu.be/")) {
      return url.replace("youtu.be/", "youtube.com/embed/");
    }
    return url;
  };

  const finalUrl = isYouTube ? convertToEmbed(videoUrl) : videoUrl;

  return (
    <div
      className={`relative w-full overflow-hidden rounded-xl ${wrapperPadding} ${className}`}
    >
      {isYouTube ? (
        <iframe
          src={finalUrl}
          className="absolute inset-0 w-full h-full"
          allow="autoplay; encrypted-media"
          allowFullScreen
        ></iframe>
      ) : (
        <video
          src={finalUrl}
          className="absolute inset-0 w-full h-full"
          controls
          playsInline
        ></video>
      )}
    </div>
  );
}
