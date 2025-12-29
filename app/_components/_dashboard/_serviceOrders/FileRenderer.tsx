"use client";
import React, { useState } from "react";
import { ServiceTrackingFile } from "./types";
import Image from "next/image";
import { FiDownload, FiFile, FiEye, FiX } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import Img from "../../_website/_global/Img";

interface FileRendererProps {
  file: ServiceTrackingFile;
}

export default function FileRenderer({ file }: FileRendererProps) {
  const [showPreview, setShowPreview] = useState(false);
  const isImage = file.mime_type?.startsWith("image/");

  // Construct URL - abstract this logic if consistent across app
  const fileUrl = file.path;

  const downloadFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = file.original_name;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <div className="group relative flex items-center gap-3 p-3 rounded-lg border border-gray-200 bg-white hover:border-primary/30 hover:shadow-sm transition-all">
        {/* Thumbnail / Icon */}
        <div
          className="w-10 h-10 shrink-0 rounded-lg bg-gray-50 flex items-center justify-center overflow-hidden border border-gray-100 relative cursor-pointer"
          onClick={() => isImage && setShowPreview(true)}
        >
          {isImage ? (
            <div className="relative w-full h-full">
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
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <span>{(file.size / 1024).toFixed(1)} KB</span>
            {isImage && (
              <span className="px-1.5 py-0.5 rounded bg-blue-50 text-blue-600 font-medium text-[10px]">
                IMG
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
          {isImage && (
            <button
              onClick={() => setShowPreview(true)}
              className="p-1.5 text-gray-500 hover:text-primary hover:bg-primary/5 rounded-md transition-colors"
              title="Preview"
            >
              <FiEye size={16} />
            </button>
          )}
          <button
            onClick={downloadFile}
            className="p-1.5 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-md transition-colors"
            title="Download"
          >
            <FiDownload size={16} />
          </button>
        </div>
      </div>

      {/* Preview Modal */}
      <AnimatePresence>
        {showPreview && isImage && (
          <div
            className="fixed inset-0 z-999999 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            onClick={() => setShowPreview(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-5xl w-full max-h-[90vh] flex flex-col items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowPreview(false)}
                className="absolute -top-12 right-0 bg-white/10 hover:bg-white/20 text-white p-2 rounded-full transition-colors"
              >
                <FiX size={24} />
              </button>

              <div className="relative w-full h-[80vh] bg-transparent rounded-lg overflow-hidden flex items-center justify-center">
                <Img // using img for full control over object-contain behavior in modal often easier than Next Image filling parent
                  src={fileUrl ?? "/defaults/noImage.png"}
                  errorSrc="/defaults/noImage.png"
                  alt={file.original_name}
                  className="max-w-full max-h-full object-contain shadow-2xl"
                />
              </div>

              <div className="mt-4">
                <button
                  onClick={downloadFile}
                  className="flex items-center gap-2 bg-white text-gray-900 px-6 py-2.5 rounded-full hover:bg-gray-100 transition-colors font-medium shadow-lg"
                >
                  <FiDownload /> تحميل الصورة
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
