"use client";

import { motion } from "framer-motion";
import { FaCheckCircle } from "react-icons/fa";

interface SuccessMessageProps {
  message: string;
}

export const SuccessMessage = ({ message }: SuccessMessageProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-lg fixed top-28 left-[40%] -translate-x-1/2 z-[999] lg:w-3/4"
    >
      <FaCheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
      <span className="text-emerald-700 font-medium">{message}</span>
    </motion.div>
  );
};
