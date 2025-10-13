"use client";

import { motion } from "framer-motion";
import { FaExclamationTriangle } from "react-icons/fa";

interface ErrorMessageProps {
  message: string;
}

export const ErrorMessage = ({ message }: ErrorMessageProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-3 p-4 bg-rose-50 border border-rose-200 rounded-lg"
    >
      <FaExclamationTriangle className="w-5 h-5 text-rose-600 flex-shrink-0" />
      <span className="text-rose-700 font-medium">{message}</span>
    </motion.div>
  );
};
