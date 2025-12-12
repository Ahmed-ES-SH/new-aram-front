"use client";

import React, { useMemo } from "react";

interface VideoBackgroundProps {
  /** Video URL - supports YouTube links or direct video file URLs */
  src: string;
  /** Optional overlay opacity (0-1), default is 0.2 */
  overlayOpacity?: number;
  /** Optional custom className for the container */
  className?: string;
}

/**
 * Checks if the URL is a YouTube link
 */
export function isYouTubeUrl(url: string): boolean {
  if (!url) return false;
  return url.includes("youtube.com") || url.includes("youtu.be");
}

/**
 * Extracts YouTube video ID from various YouTube URL formats
 */
export function extractYouTubeId(url: string): string | null {
  if (!url) return null;

  const patterns = [
    /(?:youtube\.com\/watch\?v=)([^#&?]+)/,
    /(?:youtube\.com\/embed\/)([^#&?]+)/,
    /(?:youtube\.com\/v\/)([^#&?]+)/,
    /(?:youtu\.be\/)([^#&?]+)/,
    /(?:youtube\.com\/shorts\/)([^#&?]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
}

/**
 * Generates YouTube embed URL with autoplay and loop settings
 */
export function getYouTubeEmbedUrl(videoId: string): string {
  const params = new URLSearchParams({
    autoplay: "1",
    controls: "0",
    mute: "1",
    loop: "1",
    playlist: videoId,
    enablejsapi: "1",
    modestbranding: "1",
    rel: "0",
    showinfo: "0",
    playsinline: "1",
    disablekb: "1",
    fs: "0",
    iv_load_policy: "3",
  });

  return `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
}

/**
 * VideoBackground Component
 *
 * Displays a full-screen video background that covers different screen sizes.
 * Supports both YouTube URLs and direct video file URLs.
 */
export default function VideoBackground({
  src,
  overlayOpacity = 0.2,
  className = "",
}: VideoBackgroundProps) {
  const isYouTube = useMemo(() => isYouTubeUrl(src), [src]);
  const youtubeId = useMemo(
    () => (isYouTube ? extractYouTubeId(src) : null),
    [isYouTube, src]
  );
  const embedUrl = useMemo(
    () => (youtubeId ? getYouTubeEmbedUrl(youtubeId) : null),
    [youtubeId]
  );

  if (!src) {
    return null;
  }

  return (
    <div
      className={`video-background-container ${className}`}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        overflow: "hidden",
        zIndex: 0,
      }}
    >
      {/* Dark overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: `rgba(0, 0, 0, ${overlayOpacity})`,
          pointerEvents: "none",
          zIndex: 1,
        }}
      />

      {/* Direct Video */}
      {!isYouTube && (
        <video
          src={src}
          autoPlay
          loop
          muted
          playsInline
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            minWidth: "100%",
            minHeight: "100%",
            width: "auto",
            height: "auto",
            transform: "translate(-50%, -50%)",
            objectFit: "cover",
          }}
        />
      )}

      {/* YouTube Video */}
      {isYouTube && embedUrl && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            width: "100vw",
            height: "100vh",
            transform: "translate(-50%, -50%)",
            pointerEvents: "none",
          }}
        >
          <iframe
            src={embedUrl}
            title="Background Video"
            frameBorder="0"
            allow="autoplay; encrypted-media"
            allowFullScreen={false}
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              width: "100vw",
              height: "56.25vw", // 16:9 aspect ratio
              minHeight: "100vh",
              minWidth: "177.78vh", // 16:9 aspect ratio
              transform: "translate(-50%, -50%)",
              border: "none",
            }}
          />
        </div>
      )}
    </div>
  );
}
