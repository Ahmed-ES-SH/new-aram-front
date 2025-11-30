"use client";

import { motion } from "framer-motion";
import {
  FiCheck,
  FiZap,
  FiShield,
  FiClock,
  FiAward,
  FiHeart,
  FiStar,
  FiTrendingUp,
} from "react-icons/fi";
import {
  fadeInUp,
  staggerContainer,
  chipAnimation,
} from "./animation-variants";
import { useTranslations } from "next-intl";
import { Service } from "../../_dashboard/_services/types";

interface BenefitsListProps {
  benefits: Service["benefits"];
}

const iconMap = [
  FiZap,
  FiShield,
  FiClock,
  FiAward,
  FiHeart,
  FiStar,
  FiTrendingUp,
  FiCheck,
];

export function BenefitsList({ benefits }: BenefitsListProps) {
  const t = useTranslations();

  if (benefits.length === 0) return null;

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
        <FiCheck className="w-5 h-5 text-emerald-500" />
        <h2 className="text-xl font-bold text-gray-900">
          {t("service.benefits")}
        </h2>
      </div>

      {/* Benefits Grid */}
      <motion.div
        variants={staggerContainer}
        className="grid gap-3 sm:grid-cols-2"
      >
        {benefits.map((benefit, index) => {
          const Icon = iconMap[index % iconMap.length];
          return (
            <motion.div
              key={index}
              variants={chipAnimation}
              whileHover={{ scale: 1.02, x: 4 }}
              className="flex items-start gap-3 p-4 bg-linear-to-br from-emerald-50 to-teal-50 rounded-xl border border-emerald-100"
            >
              <div className="shrink-0 w-9 h-9 bg-white rounded-lg shadow-sm flex items-center justify-center">
                <Icon className="w-4 h-4 text-emerald-500" />
              </div>
              <p className="text-gray-700 font-medium leading-relaxed pt-1.5">
                {benefit.title}
              </p>
            </motion.div>
          );
        })}
      </motion.div>
    </motion.section>
  );
}
