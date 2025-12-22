"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

// Hero section with animated title and subtitle
export default function HeroSection() {
  const t = useTranslations("servicesPage.hero");

  return (
    <section className="relative w-full bg-linear-to-b from-orange-50 to-white py-20 px-4 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-orange-100 rounded-full opacity-50 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-amber-100 rounded-full opacity-50 blur-3xl" />
      </div>

      <div className="relative max-w-4xl mx-auto text-center">
        {/* Main title with fade-in and upward animation */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 text-balance"
        >
          {t("title")}
        </motion.h1>

        {/* Subtitle with delayed animation */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto text-pretty"
        >
          {t("subtitle")}
        </motion.p>
      </div>
    </section>
  );
}
