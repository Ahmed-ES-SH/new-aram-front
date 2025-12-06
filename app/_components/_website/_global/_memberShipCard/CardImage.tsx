// components/MembershipCard/CardImage.tsx
"use client";
import React from "react";
import { motion } from "framer-motion";

interface CardImageProps {
  src: string;
  alt: string;
  isHovered: boolean;
}

const CardImage: React.FC<CardImageProps> = ({ src, alt, isHovered }) => {
  return (
    <div className="relative">
      {/* Glow effect */}
      <motion.div
        animate={{ opacity: isHovered ? 0.6 : 0.3 }}
        className="absolute inset-0 bg-blue-500/20 blur-2xl rounded-2xl"
      />

      {/* Card-like frame */}
      <div className="relative bg-linear-to-br from-gray-800 to-gray-900 rounded-2xl p-6 shadow-2xl border border-gray-700">
        {/* Metallic border */}
        <div className="absolute inset-0 rounded-2xl border-2 border-transparent bg-linear-to-br from-gray-500/10 via-gray-400/5 to-gray-500/10" />

        {/* Image container */}
        <motion.div
          animate={{ scale: isHovered ? 1.05 : 1 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="relative rounded-xl overflow-hidden border-2 border-gray-600/30"
        >
          <img src={src} alt={alt} className="w-full h-48 object-cover" />

          {/* Shine overlay */}
          <motion.div
            animate={{ x: isHovered ? "200%" : "-100%" }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent transform -skew-x-12"
          />
        </motion.div>

        {/* Corner decorations */}
        <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-blue-400/50 rounded-tl-lg" />
        <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-blue-400/50 rounded-tr-lg" />
        <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-blue-400/50 rounded-bl-lg" />
        <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-blue-400/50 rounded-br-lg" />
      </div>
    </div>
  );
};

export default CardImage;
