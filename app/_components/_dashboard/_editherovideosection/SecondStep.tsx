"use client";
import React, { ChangeEvent } from "react";
import { motion } from "framer-motion";
import { FaArrowLeft, FaCheck, FaCloudUploadAlt } from "react-icons/fa";
import RenderVideoPreview from "./RenderVideoPreview";

interface props {
  selectedMethod: "file" | "url" | null;
  videoUrl: string | null;
  aspectRatio: string;
  handleFileChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleUrlChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleBack: () => void;
  handleNext: () => void;
  fileInputRef: any;
  videoFile: any;
  error: string;
}

export default function SecondStep({
  selectedMethod,
  videoUrl,
  handleFileChange,
  fileInputRef,
  handleUrlChange,
  videoFile,
  aspectRatio,
  handleBack,
  handleNext,
  error,
}: props) {
  return (
    <motion.div
      key="step2"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
    >
      <h3 className="text-lg font-semibold text-gray-700 mb-4">
        {selectedMethod === "url"
          ? "أدخل رابط فيديو اليوتيوب"
          : "اختر ملف الفيديو"}
      </h3>

      {selectedMethod === "url" ? (
        <div className="mb-4">
          <input
            type="text"
            value={videoUrl as string}
            onChange={handleUrlChange}
            placeholder="https://www.youtube.com/watch?v=..."
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
          />
        </div>
      ) : (
        !videoFile && (
          <div className="mb-4">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="video/*"
              className="hidden"
            />
            <motion.div
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="border-2 border-dashed h-[40vh] flex items-center justify-center border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-sky-400 transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="">
                <FaCloudUploadAlt className="text-4xl text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600 mb-1">انقر لاختيار ملف الفيديو</p>
                <p className="text-sm text-gray-500">أو اسحب وأفلت الملف هنا</p>
                {videoFile && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-sm text-sky-600 mt-2 font-medium"
                  >
                    {videoFile.name}
                  </motion.p>
                )}
              </div>
            </motion.div>
          </div>
        )
      )}

      <RenderVideoPreview
        selectedMethod={selectedMethod}
        videoFile={videoFile ?? null}
        videoUrl={videoUrl ?? null}
        aspectRatio={aspectRatio}
        key={`RenderVideoPreview`}
      />

      {error && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="mt-4 p-3 bg-red-50 text-red-600 rounded-lg border border-red-200"
        >
          {error}
        </motion.div>
      )}

      <div className="flex justify-between mt-12">
        <motion.button
          whileHover={{ x: -2 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleBack}
          className="flex items-center gap-2 px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
        >
          <FaArrowLeft /> السابق
        </motion.button>

        <motion.button
          whileHover={{ x: 2 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleNext}
          disabled={
            (selectedMethod === "url" && !videoUrl) ||
            (selectedMethod === "file" && !videoFile)
          }
          className="flex items-center gap-2 px-4 py-2 text-white bg-sky-500 rounded-lg hover:bg-sky-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          التالي <FaCheck />
        </motion.button>
      </div>
    </motion.div>
  );
}
