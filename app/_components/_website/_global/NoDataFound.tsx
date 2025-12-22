"use client";

import { directionMap } from "@/app/constants/_website/global";
import { useLocale } from "next-intl";
import { motion } from "framer-motion";
import { FaInbox } from "react-icons/fa";
import React from "react";

interface Props {
  isEmpty: boolean;
}

export default function NoDataFound({ isEmpty }: Props) {
  const locale = useLocale() ?? "en";

  const messages: Record<string, string> = {
    en: "No data available.",
    ar: "لا توجد بيانات متاحة.",
  };

  if (!isEmpty) return null;

  return (
    <div
      dir={directionMap[locale]}
      className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4"
    >
      {/* Animated Icon */}
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 120, damping: 10 }}
        className="mb-6"
      >
        <FaInbox className="text-gray-400 size-28 lg:size-40" />
      </motion.div>

      {/* Animated Message */}
      <motion.p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="text-lg font-medium text-gray-600 max-w-md"
      >
        {messages[locale] ?? messages.en}
      </motion.p>
    </div>
  );
}
