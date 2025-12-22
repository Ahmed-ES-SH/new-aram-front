"use client";

import { useTranslations } from "next-intl";
import React from "react";
import { RiMapPinLine } from "react-icons/ri";
import { motion, AnimatePresence } from "framer-motion";
import { FiAlertCircle } from "react-icons/fi";

interface LocationInputProps {
  location: any;
  setOpenMap: (value: boolean) => void;
  error?: string;
}

export default function LocationInput({
  location,
  setOpenMap,
  error,
}: LocationInputProps) {
  const t = useTranslations("userProfile");

  return (
    <div className="md:col-span-2 relative">
      {/* Label */}
      <label className="block text-sm font-medium text-foreground mb-2">
        <div className="flex items-center gap-2">
          <RiMapPinLine className="w-4 h-4 text-muted-foreground" />
          {t("fields.location")}
        </div>
      </label>

      {/* Input with motion */}
      <motion.input
        type="text"
        readOnly
        value={location?.address ?? ""}
        placeholder={t("placeholders.location")}
        className={`
          w-full px-4 py-2.5 rounded-lg border 
          ${
            error
              ? "border-red-500 focus:ring-red-500"
              : "border-input focus:ring-ring"
          }
          bg-background text-foreground focus:outline-none 
          focus:ring-2 transition-all duration-300
        `}
        whileFocus={{ scale: 1.02 }}
        animate={
          error
            ? { x: [0, -4, 4, -3, 3, 0] } // Shake when error
            : {}
        }
        transition={{ duration: 0.3, ease: "easeOut" }}
      />

      {/* Edit location link */}
      <motion.div
        onClick={() => setOpenMap(true)}
        whileTap={{ scale: 0.95 }}
        className="mt-2 ltr:ml-auto rtl:mr-auto w-fit underline text-red-400 hover:text-red-600 cursor-pointer duration-200"
      >
        {t("editlocation")}
      </motion.div>

      {/* Error message animation */}
      <AnimatePresence mode="wait">
        {error && (
          <motion.div
            key={error}
            className="flex items-center gap-1 text-red-500 text-xs mt-1"
            initial={{ opacity: 0, y: -5 }}
            animate={{
              opacity: 1,
              y: 0,
              x: [0, -4, 4, -3, 3, 0], // shake effect
            }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <FiAlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
