// components/MembershipCard/CardHeader.tsx
"use client";
import React from "react";
import { motion } from "framer-motion";

interface CardHeaderProps {
  title: string;
  description: string;
}

const CardHeader: React.FC<CardHeaderProps> = ({ title, description }) => {
  return (
    <div className="space-y-2">
      <motion.h3
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
        className="text-2xl font-bold text-white"
      >
        {title}
      </motion.h3>
      <motion.p
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className="text-gray-300 text-sm leading-relaxed"
      >
        {description}
      </motion.p>
    </div>
  );
};

export default CardHeader;
