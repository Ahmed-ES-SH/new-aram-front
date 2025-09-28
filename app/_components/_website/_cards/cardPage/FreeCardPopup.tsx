"use client";

import { motion } from "framer-motion";
import { FaGift } from "react-icons/fa";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { VscLoading } from "react-icons/vsc";

interface FreeCardPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function FreeCardPopup({ isOpen, onClose }: FreeCardPopupProps) {
  const t = useTranslations("freeCardPopup");

  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const hanldeActiceCode = async () => {
    try {
    } catch (error: any) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // Animation variants
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8, y: -50 },
    visible: { opacity: 1, scale: 1, y: 0 },
  };

  return (
    <motion.div
      className="fixed inset-0 z-[99] flex items-center justify-center bg-black/50 backdrop-blur-md"
      initial="hidden"
      animate="visible"
      exit="hidden"
      variants={backdropVariants}
    >
      <motion.div
        className="bg-white z-[99] rounded-2xl shadow-xl w-full max-w-md p-8 text-center relative"
        variants={modalVariants}
        transition={{ duration: 0.3 }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>

        {/* Icon */}
        <div className="flex justify-center mb-4">
          <FaGift className="text-6xl text-primary" />
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-800 mb-6">{t("title")}</h2>

        {/* Input */}
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder={t("placeholder")}
          className="w-full border border-gray-300 rounded-lg px-4 py-3 mb-6 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        {/* Submit Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => hanldeActiceCode()}
          className="w-full flex items-center justify-center bg-primary hover:bg-orange-500 text-white font-semibold py-3 rounded-lg transition-colors duration-200"
        >
          {loading ? <VscLoading /> : t("submit")}
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
