"use client";

import type React from "react";
import { useState, type ReactNode } from "react";
import { motion } from "framer-motion";
import Img from "../Img";

interface CardContainerProps {
  children: ReactNode;
  onHoverStart?: () => void;
  onHoverEnd?: () => void;
  isRTL?: boolean;
  image?: string;
}

export function CardContainer({
  children,
  onHoverStart,
  onHoverEnd,
  isRTL = false,
  image,
}: CardContainerProps) {
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateXValue = ((y - centerY) / centerY) * -8;
    const rotateYValue = ((x - centerX) / centerX) * 8;

    setRotateX(rotateXValue);
    setRotateY(rotateYValue);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
    onHoverEnd?.();
  };

  return (
    <motion.div
      className="relative w-full  md:aspect-[1.6/1] cursor-pointer"
      style={{ perspective: 1000 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={onHoverStart}
      onMouseLeave={handleMouseLeave}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <motion.div
        className="relative w-full h-full rounded-2xl overflow-hidden"
        animate={{
          rotateX,
          rotateY,
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30,
        }}
        style={{
          transformStyle: "preserve-3d",
        }}
      >
        <div
          className="absolute inset-0 rounded-2xl"
          style={{
            boxShadow: `
              0 25px 50px -12px rgba(0, 0, 0, 0.4),
              0 12px 24px -8px rgba(0, 0, 0, 0.3),
              inset 0 1px 0 rgba(255, 255, 255, 0.1),
              inset 0 -1px 0 rgba(0, 0, 0, 0.2)
            `,
          }}
        >
          {/* Background Image */}
          {image ? (
            <Img
              src={image}
              errorSrc="/defaults/noImage.png"
              alt="Card background"
              className="absolute inset-0 w-full h-full object-cover rounded-2xl"
            />
          ) : (
            /* Placeholder gradient when image fails or is missing */
            <div className="absolute inset-0 rounded-2xl bg-linear-to-br from-slate-800 via-slate-700 to-slate-900" />
          )}
          {/* Dark overlay for text readability */}
          <div className="absolute inset-0 rounded-2xl bg-black/40" />
        </div>

        {/* Shimmer overlay */}
        <div className="absolute inset-0 card-shimmer rounded-2xl pointer-events-none" />

        {/* Content */}
        <div className="relative z-10 w-full h-full">{children}</div>

        {/* Edge highlight */}
        <div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{
            background: `linear-gradient(
              135deg,
              rgba(255, 255, 255, 0.15) 0%,
              transparent 50%,
              rgba(0, 0, 0, 0.1) 100%
            )`,
          }}
        />
      </motion.div>
    </motion.div>
  );
}
