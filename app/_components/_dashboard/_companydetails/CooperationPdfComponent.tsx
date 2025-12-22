"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiUpload, FiDownload, FiX, FiEye } from "react-icons/fi";
import FilePreview from "./FilePreview";

type Props = {
  fileUrl?: string | null;
  onUpload: (file: File) => void;
};

export default function CooperationPdfViewer({ fileUrl, onUpload }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Trigger File Picker
  const openFilePicker = () => fileInputRef.current?.click();

  // Handle Upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === "application/pdf") {
      onUpload(file);
      setFile(file);
    }
  };

  // Handle Download
  const handleDownload = () => {
    if (!fileUrl) return;

    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = "cooperation.pdf";
    link.click();
  };

  return (
    <div className="w-full my-4 pb-3 border-b-2 border-sky-500">
      <h1 className="text-xl w-fit mx-auto font-semibold text-center pb-4">
        اتفاقية التعاون للمنصة
      </h1>

      <div className="flex flex-col items-center gap-4">
        {/* PDF File Section */}
        <FilePreview
          fileUrl={fileUrl}
          file={file}
          openFilePicker={openFilePicker}
        />

        {/* Buttons */}
        <div className="flex items-center gap-4">
          {fileUrl && (
            <>
              <button
                type="button"
                onClick={handleDownload}
                className="px-4 py-2 rounded-md bg-gray-800 text-white flex items-center gap-2 hover:bg-gray-900"
              >
                <FiDownload /> تحميل
              </button>
            </>
          )}
        </div>

        <input
          type="file"
          accept="application/pdf"
          className="hidden"
          ref={fileInputRef}
          onChange={handleFileChange}
        />
      </div>
    </div>
  );
}
