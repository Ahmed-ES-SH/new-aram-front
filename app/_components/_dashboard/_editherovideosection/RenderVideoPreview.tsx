"use client";
import React from "react";
import { motion } from "framer-motion";

interface RenderVideoPreviewProps {
  selectedMethod: "file" | "url" | null;
  videoFile: File | null;
  videoUrl: string | null;
  aspectRatio: string;
}

export default function RenderVideoPreview({
  selectedMethod,
  videoFile,
  videoUrl,
  aspectRatio,
}: RenderVideoPreviewProps) {
  const getVideoIdFromUrl = (url: string): string | null => {
    const match = url.match(
      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
    );
    return match ? match[1] : null;
  };

  const getAspectRatioClass = (ratio: string): string => {
    switch (ratio) {
      case "16:9":
        return "aspect-video"; // 16:9
      case "9:16":
        return "aspect-[9/16] max-h-96";
      case "1:1":
        return "aspect-square max-w-md mx-auto";
      case "4:3":
        return "aspect-[4/3]";
      case "21:9":
        return "aspect-[21/9]";
      default:
        return "";
    }
  };

  if (selectedMethod === "url" && videoUrl) {
    const videoId = getVideoIdFromUrl(videoUrl);

    if (videoId) {
      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4"
        >
          <label className="block text-gray-600 font-medium mb-2">
            معاينة الفيديو:
          </label>
          <div
            className={`${getAspectRatioClass(
              aspectRatio
            )} rounded-lg overflow-hidden bg-black`}
          >
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${videoId}`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            />
          </div>
        </motion.div>
      );
    }
  } else if (selectedMethod === "file" && videoFile) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-4"
      >
        <label className="block text-gray-600 font-medium mb-2">
          معاينة الفيديو:
        </label>
        <div
          className={`${getAspectRatioClass(
            aspectRatio
          )} rounded-lg overflow-hidden bg-black`}
        >
          <video
            src={URL.createObjectURL(videoFile)}
            controls
            className="w-full h-full object-contain"
          />
        </div>
      </motion.div>
    );
  }

  return null;
}
