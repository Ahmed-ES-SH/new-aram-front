"use client";
import React from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

export default function ServiceSliderHeader() {
  const t = useTranslations("serviceSlider");
  return (
    <div className="text-center mb-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          {t("title")}{" "}
          <span className={`relative inline-block`}>
            <span
              className={`relative z-10 bg-linear-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent`}
            >
              {t("titleHighlight")}
            </span>
            <span className="absolute bottom-1 left-0 w-full h-3 bg-blue-100 -z-10 rounded-full"></span>
          </span>
        </h2>
      </motion.div>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto"
      >
        {t("subtitle")}
      </motion.p>
    </div>
  );
}
