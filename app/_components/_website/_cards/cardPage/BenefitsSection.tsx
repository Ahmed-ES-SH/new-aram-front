"use client";

import { motion } from "framer-motion";
import { FaGift, FaCheckCircle } from "react-icons/fa";
import { BenefitsSectionProps } from "./types";

export default function BenefitsSection({
  benefits,
  locale,
  t,
}: BenefitsSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 p-8 border border-slate-100"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
          <FaGift className="text-white text-xl" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-800">{t("benefits")}</h2>
          <p className="text-sm text-slate-500">
            {locale === "en"
              ? "What you'll get with this card"
              : "ما ستحصل عليه مع هذه البطاقة"}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {benefits?.map((benefit, index) => (
          <motion.div
            key={benefit.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 + index * 0.1 }}
            className="group flex items-center gap-4 p-4 rounded-2xl bg-linear-to-r from-emerald-50 to-teal-50 border border-emerald-100 hover:shadow-lg hover:shadow-emerald-100/50 transition-all duration-300"
          >
            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-emerald-500 to-teal-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
              <FaCheckCircle className="text-white" />
            </div>
            <span className="text-slate-700 font-medium">{benefit.title}</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
