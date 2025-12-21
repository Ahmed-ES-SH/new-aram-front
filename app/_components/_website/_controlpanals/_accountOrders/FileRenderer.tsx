"use client";
import React, { useState } from "react";
import { ServiceTrackingFile } from "./serviceOrderTypes";
import Image from "next/image";
import { FiDownload, FiFile, FiEye, FiX } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

interface FileRendererProps {
  file: ServiceTrackingFile;
}

export default function FileRenderer({ file }: FileRendererProps) {
  const [showPreview, setShowPreview] = useState(false);
  const isImage = file.mime_type?.startsWith("image/");

  // Assuming public_path disk maps to root or public URL structure
  // Adjust base URL if needed based on actual backend serving logic
  // For now using raw path, assuming it's a full URL or relative to public
  // If "public_path" implies a specific prefix like /storage/, it might need adjustment
  // But based on user JSON "uploads/...", it looks relative.
  const fileUrl = `${process.env.NEXT_PUBLIC_IMAGE_URL || ""}/${file.path}`;

  const downloadFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = file.original_name;
    link.target = "_blank"; // Fallback if download doesn't trigger
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <div className="group relative flex items-center gap-3 p-3 rounded-lg border border-gray-100 bg-white hover:shadow-md transition-all">
        {/* Icon / Thumbnail */}
        <div className="w-10 h-10 shrink-0 rounded-lg bg-gray-50 flex items-center justify-center overflow-hidden border border-gray-100 relative">
          {isImage ? (
            <div
              className="relative w-full h-full cursor-pointer"
              onClick={() => setShowPreview(true)}
            >
              <Image
                src={fileUrl}
                alt={file.original_name}
                fill
                className="object-cover"
              />
            </div>
          ) : (
            <FiFile className="text-gray-400 text-lg" />
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p
            className="text-sm font-medium text-gray-700 truncate"
            title={file.original_name}
          >
            {file.original_name}
          </p>
          <p className="text-xs text-gray-400">
            {(file.size / 1024).toFixed(1)} KB
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1">
          {isImage && (
            <button
              onClick={() => setShowPreview(true)}
              className="p-1.5 text-gray-500 hover:text-primary hover:bg-primary/5 rounded-md transition-colors"
              title="Preview"
            >
              <FiEye />
            </button>
          )}
          <button
            onClick={downloadFile}
            className="p-1.5 text-gray-500 hover:text-primary hover:bg-primary/5 rounded-md transition-colors"
            title="Download"
          >
            <FiDownload />
          </button>
        </div>
      </div>

      {/* Image Preview Modal */}
      <AnimatePresence>
        {showPreview && isImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            onClick={() => setShowPreview(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-4xl max-h-[90vh] w-full bg-transparent flex flex-col items-center"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowPreview(false)}
                className="absolute -top-12 right-0 text-white hover:text-gray-300 p-2"
              >
                <FiX size={24} />
              </button>
              <div className="relative w-full h-[80vh] rounded-lg overflow-hidden bg-black">
                <Image
                  src={fileUrl}
                  alt={file.original_name}
                  fill
                  className="object-contain"
                />
              </div>
              <div className="mt-4 flex gap-4">
                <button
                  onClick={downloadFile}
                  className="flex items-center gap-2 bg-white text-gray-900 px-6 py-2 rounded-full hover:bg-gray-100 transition-colors font-medium"
                >
                  <FiDownload /> Download Original
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
