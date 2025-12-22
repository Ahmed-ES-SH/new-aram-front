// components/MembershipCard/CardContainer.tsx
"use client";
import React from "react";
import { motion } from "framer-motion";

interface CardContainerProps {
  children: React.ReactNode;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

const CardContainer: React.FC<CardContainerProps> = ({
  children,
  onMouseEnter,
  onMouseLeave,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{
        scale: 1.02,
        boxShadow: "0 20px 40px rgba(0, 0, 0, 0.15)",
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className="relative w-full max-w-4xl mx-auto bg-linear-to-br from-gray-900 via-gray-800 to-gray-900 rounded-3xl overflow-hidden shadow-2xl"
      style={{
        background: `
          linear-gradient(135deg, 
            rgba(30, 41, 59, 0.95) 0%,
            rgba(15, 23, 42, 0.95) 50%,
            rgba(30, 41, 59, 0.95) 100%
          ),
          radial-gradient(
            circle at 20% 80%,
            rgba(59, 130, 246, 0.15) 0%,
            transparent 50%
          ),
          radial-gradient(
            circle at 80% 20%,
            rgba(139, 92, 246, 0.1) 0%,
            transparent 50%
          )
        `,
      }}
    >
      {/* Metallic border effect */}
      <div className="absolute inset-0 border-2 border-transparent rounded-3xl p-[2px]">
        <div className="absolute inset-0 rounded-3xl bg-linear-to-br from-gray-400/20 via-gray-600/10 to-gray-400/20" />
      </div>

      {/* Subtle texture overlay */}
      <div className="absolute inset-0 bg-noise opacity-10 pointer-events-none" />

      {children}
    </motion.div>
  );
};

export default CardContainer;
