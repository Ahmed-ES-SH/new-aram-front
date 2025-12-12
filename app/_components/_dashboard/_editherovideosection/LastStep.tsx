"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import RenderVideoPreview from "./RenderVideoPreview";
import { FaArrowLeft, FaCheck, FaCrop } from "react-icons/fa";
import { VscLoading } from "react-icons/vsc";
import CircularProgress from "./CircularProgress";

interface AspectRatioOption {
  label: string;
  value: string;
  description: string;
  icon?: React.ReactNode;
}

interface props {
  selectedMethod: "file" | "url" | null;
  videoUrl: string | null;
  isConfirmed: boolean;
  handleBack: () => void;
  handleReset: () => void;
  handleConfirm: () => void;
  onClose: () => void;
  videoFile: any;
  aspectRatio: string;
  uploadProgress: number;
  setAspectRatio: (ratio: string) => void;
  loading: boolean;
}

export default function LastStep({
  selectedMethod,
  videoUrl,
  isConfirmed,
  handleBack,
  handleReset,
  handleConfirm,
  onClose,
  videoFile,
  aspectRatio,
  uploadProgress,
  setAspectRatio,
  loading,
}: props) {
  const [showAspectRatio, setShowAspectRatio] = useState(false);

  const aspectRatioOptions: AspectRatioOption[] = [
    {
      label: "16:9",
      value: "16:9",
      description: "شاشة عريضة (يوتيوب)",
    },
    {
      label: "9:16",
      value: "9:16",
      description: "عمودي (تيك توك)",
    },
    {
      label: "1:1",
      value: "1:1",
      description: "مربع (انستغرام)",
    },
    {
      label: "4:3",
      value: "4:3",
      description: "تقليدي (تلفزيون)",
    },
    {
      label: "21:9",
      value: "21:9",
      description: "سینمائي",
    },
    {
      label: "أصلي",
      value: "original",
      description: "حجم الفيديو الأصلي",
    },
  ];

  return (
    <motion.div
      key="step3"
      dir="rtl"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <h3 className="text-lg font-semibold text-gray-700">
        تأكيد اختيار الفيديو
      </h3>

      {/* معلومات الفيديو */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-50 p-4 rounded-lg"
      >
        <p className="text-gray-600 mb-2">
          <span className="font-medium">طريقة الإضافة:</span>
          {selectedMethod === "url" ? " رابط يوتيوب" : " ملف مرفوع"}
        </p>

        {selectedMethod === "url" ? (
          <p className="text-gray-600 break-all">
            <span className="font-medium">الرابط:</span> {videoUrl}
          </p>
        ) : videoFile ? (
          <p className="text-gray-600">
            <span className="font-medium">الملف:</span> {videoFile.name}
          </p>
        ) : null}
      </motion.div>

      {/* زر عرض/إخفاء خيارات aspect ratio */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <button
          onClick={() => setShowAspectRatio(!showAspectRatio)}
          className="flex items-center justify-between w-full p-3 bg-sky-50 hover:bg-sky-100 rounded-lg transition-colors group"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-sky-100 rounded-lg group-hover:bg-sky-200 transition-colors">
              <FaCrop className="text-sky-600" />
            </div>
            <div className="text-right">
              <h4 className="font-medium text-gray-800">
                نسبة العرض إلى الارتفاع
              </h4>
              <p className="text-sm text-gray-600">
                {aspectRatioOptions.find((opt) => opt.value === aspectRatio)
                  ?.label || "اختر النسبة"}
              </p>
            </div>
          </div>
          <motion.div
            animate={{ rotate: showAspectRatio ? 180 : 0 }}
            className="text-gray-500"
          >
            ▼
          </motion.div>
        </button>
      </motion.div>

      {/* قائمة خيارات aspect ratio */}
      <AnimatePresence>
        {showAspectRatio && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 p-1">
              {aspectRatioOptions.map((option) => (
                <motion.button
                  key={option.value}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setAspectRatio(option.value);
                    setShowAspectRatio(false);
                  }}
                  className={`
                    flex flex-col items-center p-4 rounded-xl border-2
                    transition-all duration-200
                    ${
                      aspectRatio === option.value
                        ? "border-sky-500 bg-sky-50 shadow-sm"
                        : "border-gray-200 hover:border-sky-300 hover:bg-gray-50"
                    }
                  `}
                >
                  <div className="relative w-16 h-12 mb-2">
                    {/* Visual representation of aspect ratio */}
                    <div className="absolute inset-0 border border-gray-300 rounded-lg overflow-hidden">
                      <div
                        className={`absolute bg-sky-500 ${
                          option.value === "16:9"
                            ? "w-full h-3/4 top-1/8"
                            : option.value === "9:16"
                            ? "w-3/4 h-full left-1/8"
                            : option.value === "1:1"
                            ? "w-3/4 h-3/4 top-1/8 left-1/8"
                            : option.value === "4:3"
                            ? "w-full h-2/3 top-1/6"
                            : option.value === "21:9"
                            ? "w-full h-1/2 top-1/4"
                            : "w-3/4 h-3/4 top-1/8 left-1/8"
                        }`}
                      />
                    </div>
                    {aspectRatio === option.value && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-1 -right-1 w-5 h-5 bg-sky-500 rounded-full flex items-center justify-center"
                      >
                        <FaCheck className="text-white text-xs" />
                      </motion.div>
                    )}
                  </div>
                  <span
                    className={`font-medium text-sm ${
                      aspectRatio === option.value
                        ? "text-sky-700"
                        : "text-gray-800"
                    }`}
                  >
                    {option.label}
                  </span>
                  <span className="text-xs text-gray-500 mt-1">
                    {option.description}
                  </span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* معاينة الفيديو */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {uploadProgress == 0 && (
          <RenderVideoPreview
            selectedMethod={selectedMethod}
            videoFile={videoFile ?? null}
            videoUrl={videoUrl ?? null}
            aspectRatio={aspectRatio}
            key={`RenderVideoPreview-${aspectRatio}`}
          />
        )}
      </motion.div>

      {/* شاشة التحميل الفوقية */}
      {selectedMethod === "file" &&
        uploadProgress > 0 &&
        uploadProgress < 100 && (
          <div className="absolute inset-0 bg-white/90 backdrop-blur-sm rounded-xl z-10 flex flex-col items-center justify-center">
            <div className="text-center">
              <CircularProgress progress={uploadProgress} />
              <h3 className="mt-6 text-xl font-semibold text-gray-800">
                جاري رفع الفيديو...
              </h3>
              <p className="mt-2 text-gray-600">
                يرجى الانتظار حتى اكتمال رفع الفيديو
              </p>
              <p className="mt-1 text-sm text-gray-500">
                لا تغلق النافذة حتى يكتمل الرفع
              </p>
            </div>
          </div>
        )}

      {/* الأزرار */}
      {!isConfirmed ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex justify-between mt-6"
        >
          <motion.button
            whileHover={{ x: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleBack}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <FaArrowLeft /> السابق
          </motion.button>

          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleReset}
              className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              بدء من جديد
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleConfirm}
              disabled={loading}
              style={{ cursor: loading ? "not-allowed" : "pointer" }}
              className="disabled:opacity-100 disabled:cursor-not-allowed flex items-center justify-center gap-2 px-4 py-2 text-white bg-green-500 rounded-lg hover:bg-green-600 transition-colors"
            >
              {loading ? (
                <VscLoading className="size-5 animate-spin" />
              ) : (
                <span className="flex items-center gap-1">
                  تأكيد <FaCheck />
                </span>
              )}
            </motion.button>
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-4"
        >
          <div className="text-green-600 font-semibold mb-3">
            ✓ تم حفظ الفيديو بنجاح
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
            className="px-4 py-2 text-white bg-sky-500 rounded-lg hover:bg-sky-600 transition-colors"
          >
            إغلاق
          </motion.button>
        </motion.div>
      )}
    </motion.div>
  );
}
