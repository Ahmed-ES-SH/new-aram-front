// components/centers/KeywordTag.tsx
"use client";
import React from "react";
import { motion } from "framer-motion";

interface KeywordTagProps {
  keyword: string;
  index: number;
}

const KeywordTag: React.FC<KeywordTagProps> = ({ keyword, index }) => {
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ scale: 1.05, y: -2 }}
      className="inline-block px-3 py-1.5 bg-linear-to-r from-gray-50 to-gray-100 
                 text-gray-700 text-sm font-medium rounded-full 
                 border border-gray-200 shadow-sm hover:shadow-md 
                 transition-shadow duration-200"
    >
      {keyword}
    </motion.span>
  );
};

export default KeywordTag;
