"use client";
import { motion } from "framer-motion";
import { FaTimes } from "react-icons/fa";

interface PopupHeaderProps {
  title: string;
  onClose: () => void;
}

export default function PopupHeader({ title, onClose }: PopupHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <motion.button
        whileHover={{ rotate: 90, scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={onClose}
        className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
        aria-label="إغلاق"
      >
        <FaTimes size={20} />
      </motion.button>
      <h2 className="text-xl font-bold pb-3 border-b border-primary text-gray-800">
        {title}
      </h2>
    </div>
  );
}
