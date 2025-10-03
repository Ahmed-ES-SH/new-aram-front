"use client";
import { FiFile, FiFileText, FiImage, FiPlay, FiX } from "react-icons/fi";
import { motion } from "framer-motion";
import Img from "../_global/Img";

interface props {
  file: any;
  onRemove?: () => void;
}

export default function FilePreview({ file, onRemove }: props) {
  const renderPreview = () => {
    switch (file.type) {
      case "image":
        return (
          <div className="relative">
            <Img
              src={file.url}
              alt={file.name}
              className="w-16 h-16 object-cover rounded-lg"
            />
            <FiImage
              className="absolute bottom-1 right-1 text-white bg-black bg-opacity-50 rounded p-1"
              size={16}
            />
          </div>
        );
      case "audio":
        return (
          <button
            onClick={() => {
              const audio = new Audio(file.url);
              audio.play();
            }}
            className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 transition p-3 rounded-lg w-full text-left"
          >
            <FiPlay className="text-blue-500" size={20} />
            <span className="text-sm font-medium truncate">{file.name}</span>
          </button>
        );

      case "pdf":
        return (
          <div className="flex items-center space-x-2 bg-red-50 p-3 rounded-lg">
            <FiFileText className="text-red-500" size={20} />
            <span className="text-sm font-medium">{file.name}</span>
          </div>
        );
      default:
        return (
          <div className="flex items-center space-x-2 bg-gray-100 p-3 rounded-lg">
            <FiFile className="text-gray-500" size={20} />
            <span className="text-sm font-medium">{file.name}</span>
          </div>
        );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className="relative"
    >
      {renderPreview()}
      {onRemove && (
        <button
          onClick={onRemove}
          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
        >
          <FiX size={12} />
        </button>
      )}
    </motion.div>
  );
}
