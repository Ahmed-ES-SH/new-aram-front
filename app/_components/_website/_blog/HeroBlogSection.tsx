"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import Img from "../_global/Img";

export default function HeroBlogSection() {
  const t = useTranslations("articles.hero");

  return (
    <section className="relative mt-20 h-[60vh] min-h-[400px] flex items-center justify-center overflow-hidden">
      <Img
        src="/main-gray-bg.jpg"
        className="absolute w-full h-full object-cover inset-0"
      />

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-4xl md:text-6xl font-bold text-primary mb-6 text-balance"
        >
          {t("title")}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="text-lg md:text-xl text-foreground mb-8 text-pretty max-w-2xl mx-auto"
        >
          {t("subtitle")}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
        >
          <button
            onClick={() => {
              const articlesSection =
                document.getElementById("articles-section");
              articlesSection?.scrollIntoView({ behavior: "smooth" });
            }}
            className="bg-white text-primary px-8 py-3 rounded-lg font-semibold hover:bg-white/90  duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 transition-transform"
          >
            {t("explore")}
          </button>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
          className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center"
        >
          <div className="w-1 h-3 bg-white/70 rounded-full mt-2" />
        </motion.div>
      </motion.div>
    </section>
  );
}
