"use client";

import type React from "react";

import { motion } from "framer-motion";
import type { IconType } from "react-icons";

interface SocialButtonProps {
  provider: "google" | "facebook";
  icon: IconType;
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}

export function SocialButton({
  provider,
  icon: Icon,
  children,
  onClick,
  disabled = false,
}: SocialButtonProps) {
  const getProviderStyles = () => {
    switch (provider) {
      case "google":
        return "border-green-200 hover:bg-gray-50";
      case "facebook":
        return "border-blue-200 hover:bg-blue-50";
      default:
        return "border-gray-300 hover:bg-gray-50";
    }
  };

  const getIconColor = () => {
    switch (provider) {
      case "google":
        return "text-red-500";
      case "facebook":
        return "text-blue-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={disabled}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      className={`
        w-full flex items-center justify-center gap-3 px-4 py-3
        border-2 rounded-lg font-medium text-gray-700 dark:text-gray-300
        transition-all duration-200 ease-in-out
        focus:outline-none  focus:border-blue-500
        disabled:opacity-50 disabled:cursor-not-allowed
        ${getProviderStyles()}
      `}
    >
      <Icon className={`w-5 h-5 ${getIconColor()}`} />
      <span>{children}</span>
    </motion.button>
  );
}
