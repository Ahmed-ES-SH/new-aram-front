"use client";

import { motion } from "framer-motion";
import { FiTag } from "react-icons/fi";
import { useTranslations } from "next-intl";

export default function AddOfferHeader() {
  const t = useTranslations("addOfferHeader");

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="relative overflow-hidden bg-gradient-to-r from-primary/90 to-primary rounded-2xl text-white px-8 py-10 shadow-md mb-10"
    >
      {/* Decorative Icon in background */}
      <motion.div
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 0.15, scale: 1 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        className="absolute right-10 top-6 text-white/20"
      >
        <FiTag className="w-32 h-32" />
      </motion.div>

      {/* Main Content */}
      <div className="relative z-10">
        <h1 className="text-3xl md:text-4xl font-bold mb-3">{t("title")}</h1>
        <p className="text-white/90 text-sm md:text-base max-w-2xl">
          {t("subtitle")}
        </p>
      </div>
    </motion.header>
  );
}
