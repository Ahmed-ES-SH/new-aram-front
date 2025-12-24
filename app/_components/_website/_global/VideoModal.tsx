"use client";

import { AnimatePresence, motion } from "framer-motion";
import { LuX } from "react-icons/lu";
import {
  extractYouTubeId,
  getYouTubeEmbedUrl,
  isYouTubeUrl,
} from "./_VideoPlayer/VideoBackground";
import { useMemo } from "react";

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl: string | null;
}

export default function VideoModal({
  isOpen,
  onClose,
  videoUrl,
}: VideoModalProps) {
  const isYouTube = useMemo(
    () => (videoUrl ? isYouTubeUrl(videoUrl) : false),
    [videoUrl]
  );
  const youtubeId = useMemo(
    () => (isYouTube && videoUrl ? extractYouTubeId(videoUrl) : null),
    [isYouTube, videoUrl]
  );
  const embedUrl = useMemo(
    () => (youtubeId ? getYouTubeEmbedUrl(youtubeId) : null),
    [youtubeId]
  );

  return (
    <AnimatePresence>
      {isOpen && videoUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative w-full max-w-5xl aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors"
            >
              <LuX className="w-6 h-6" />
            </button>

            {isYouTube && embedUrl ? (
              <iframe
                src={embedUrl}
                title="Demo Video"
                className="w-full h-full"
                allow="autoplay; encrypted-media"
                allowFullScreen
              />
            ) : (
              <video
                src={videoUrl}
                controls
                autoPlay
                className="w-full h-full"
              />
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
