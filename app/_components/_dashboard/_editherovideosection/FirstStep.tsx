"use client";
import React from "react";
import { motion } from "framer-motion";
import VideoMethodCard from "./VideoMethodCard";
import { FaCloudUploadAlt, FaLink } from "react-icons/fa";

interface props {
  selectedMethod: "file" | "url" | null;
  onMethodSelect: (string) => void;
}

export default function FirstStep({ selectedMethod, onMethodSelect }: props) {
  return (
    <motion.div
      key="step1"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="w-[90%] mx-auto py-12"
    >
      <h3 className="text-lg font-semibold text-gray-700 mb-4">
        كيف تريد إضافة الفيديو؟
      </h3>

      <div className="grid md:grid-cols-2 gap-4">
        <VideoMethodCard
          icon={<FaCloudUploadAlt size={32} />}
          title="رفع ملف فيديو"
          description="ارفع فيديو من جهازك"
          isSelected={selectedMethod === "file"}
          onClick={() => onMethodSelect("file")}
        />

        <VideoMethodCard
          icon={<FaLink size={32} />}
          title="رابط يوتيوب"
          description="أدخل رابط فيديو من اليوتيوب"
          isSelected={selectedMethod === "url"}
          onClick={() => onMethodSelect("url")}
        />
      </div>
    </motion.div>
  );
}
