"use client";
import {
  FiFile,
  FiFileText,
  FiImage,
  FiPlay,
  FiPause,
  FiX,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import Img from "../_global/Img";
import { useState } from "react";

interface props {
  file: any;
  onRemove?: () => void;
}

export default function FilePreview({ file, onRemove }: props) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(
    null
  );

  const handlePlayAudio = () => {
    if (isPlaying && audioElement) {
      audioElement.pause();
      setIsPlaying(false);
    } else {
      const audio = new Audio(file.url);
      setAudioElement(audio);
      audio.play();
      setIsPlaying(true);
      audio.onended = () => setIsPlaying(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const renderPreview = () => {
    switch (file.type) {
      case "image":
        return (
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="relative overflow-hidden rounded-2xl shadow-lg"
          >
            <Img
              src={file.url}
              alt={file.name}
              className="w-20 h-20 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
            <div className="absolute bottom-1.5 right-1.5 bg-white/90 backdrop-blur-sm rounded-lg px-1.5 py-0.5">
              <FiImage className="text-primary size-4" />
            </div>
          </motion.div>
        );

      case "audio":
        return (
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="flex items-center gap-4 bg-gradient-to-r from-primary/10 to-primary/5 p-4 rounded-2xl border border-primary/20 min-w-[250px]"
          >
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handlePlayAudio}
              className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-white shadow-lg shadow-primary/30"
            >
              {isPlaying ? (
                <FiPause className="size-5" />
              ) : (
                <FiPlay className="size-5 ml-0.5" />
              )}
            </motion.button>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-800 truncate">
                {file.name}
              </p>
              <p className="text-xs text-gray-500">
                {file.size && formatFileSize(file.size)}
              </p>
            </div>
          </motion.div>
        );

      case "pdf":
        return (
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="flex items-center gap-4 bg-gradient-to-r from-red-50 to-red-50/50 p-4 rounded-2xl border border-red-100 min-w-[250px]"
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shadow-lg shadow-red-500/30">
              <FiFileText className="text-white size-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-800 truncate">
                {file.name}
              </p>
              <p className="text-xs text-gray-500">
                PDF • {file.size && formatFileSize(file.size)}
              </p>
            </div>
          </motion.div>
        );

      default:
        return (
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-100 min-w-[250px]"
          >
            <div className="w-12 h-12 rounded-xl bg-gray-200 flex items-center justify-center">
              <FiFile className="text-gray-500 size-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-800 truncate">
                {file.name}
              </p>
              <p className="text-xs text-gray-500">
                {file.size && formatFileSize(file.size)}
              </p>
            </div>
          </motion.div>
        );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 10 }}
      className="relative inline-block"
    >
      {renderPreview()}
      {onRemove && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onRemove}
          className="absolute -top-2 -right-2 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-red-600 transition-colors duration-200"
        >
          <FiX size={14} />
        </motion.button>
      )}
    </motion.div>
  );
}
