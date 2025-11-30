"use client";

import { motion } from "framer-motion";
import { FiHash } from "react-icons/fi";
import {
  fadeInUp,
  staggerContainer,
  chipAnimation,
} from "./animation-variants";
import { useTranslations } from "next-intl";
import { Service } from "../../_dashboard/_services/types";

interface KeywordsSectionProps {
  keywords: Service["keywords"];
}

export function KeywordsSection({ keywords }: KeywordsSectionProps) {
  const t = useTranslations();

  if (keywords.length === 0) return null;

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={fadeInUp}
      className="space-y-4"
    >
      {/* Section Header */}
      <div className="flex items-center gap-2">
        <FiHash className="w-5 h-5 text-purple-500" />
        <h2 className="text-xl font-bold text-gray-900">
          {t("service.keywords")}
        </h2>
      </div>

      {/* Keywords Chips */}
      <motion.div variants={staggerContainer} className="flex flex-wrap gap-2">
        {keywords.map((keyword, index) => (
          <motion.span
            key={index}
            variants={chipAnimation}
            whileHover={{
              scale: 1.08,
              backgroundColor: "#F3E8FF",
              color: "#7C3AED",
            }}
            className="px-4 py-2 bg-gray-100 text-gray-600 rounded-full text-sm font-medium cursor-pointer transition-colors"
          >
            #{keyword.title}
          </motion.span>
        ))}
      </motion.div>
    </motion.section>
  );
}
