// components/MembershipCard/BadgeList.tsx
"use client";
import React from "react";
import { motion } from "framer-motion";
import { Keyword } from "../KeywordSelector";

interface BadgeListProps {
  keywords: Keyword[];
}

const BadgeList: React.FC<BadgeListProps> = ({ keywords }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="flex flex-wrap gap-2 pt-4 border-t border-gray-700/50"
    >
      {keywords.map((keyword, index) => (
        <motion.span
          key={keyword.id}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 * index }}
          whileHover={{ scale: 1.05 }}
          className="px-3 py-1.5 bg-linear-to-r from-gray-800 to-gray-700 text-gray-200 text-xs font-medium rounded-full border border-gray-600/50 hover:border-blue-500/50 transition-colors"
        >
          {keyword.title}
        </motion.span>
      ))}
    </motion.div>
  );
};

export default BadgeList;
