"use client";

import { motion } from "framer-motion";
import { FiFileText } from "react-icons/fi";
import { fadeInUp } from "./animation-variants";
import { useTranslations } from "next-intl";

interface DescriptionSectionProps {
  description: string;
}

export function DescriptionSection({ description }: DescriptionSectionProps) {
  const t = useTranslations();

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
        <FiFileText className="w-5 h-5 text-gray-500" />
        <h2 className="text-xl font-bold text-gray-900">
          {t("service.description")}
        </h2>
      </div>

      {/* Description Content */}
      <motion.div
        className="prose prose-gray max-w-none"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <p className="text-gray-600 leading-relaxed text-base whitespace-pre-line">
          {description}
        </p>
      </motion.div>
    </motion.section>
  );
}
