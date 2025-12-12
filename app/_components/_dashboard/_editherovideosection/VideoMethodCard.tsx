"use client";
import { motion } from "framer-motion";

interface VideoMethodCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  isSelected: boolean;
  onClick: () => void;
}

export default function VideoMethodCard({
  icon,
  title,
  description,
  isSelected,
  onClick,
}: VideoMethodCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`
      flex flex-col items-center p-6 rounded-2xl border-2 cursor-pointer
      transition-all duration-200
      ${
        isSelected
          ? "border-sky-500 bg-sky-50 shadow-md"
          : "border-gray-200 hover:border-sky-300 hover:bg-sky-50"
      }
    `}
      onClick={onClick}
    >
      <div className={`mb-3 ${isSelected ? "text-sky-600" : "text-gray-500"}`}>
        {icon}
      </div>
      <h4
        className={`font-semibold mb-2 ${
          isSelected ? "text-sky-700" : "text-gray-800"
        }`}
      >
        {title}
      </h4>
      <p className="text-sm text-gray-600 text-center">{description}</p>
    </motion.div>
  );
}
