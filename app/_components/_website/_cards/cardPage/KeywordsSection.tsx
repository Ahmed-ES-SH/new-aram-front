"use client";

import { motion } from "framer-motion";
import { FaTag } from "react-icons/fa";
import { KeywordsSectionProps } from "./types";

export default function KeywordsSection({
  keywords,
  locale,
  t,
}: KeywordsSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 p-8 border border-slate-100"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-violet-500 to-purple-600 flex items-center justify-center">
          <FaTag className="text-white text-xl" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-800">{t("keywords")}</h2>
          <p className="text-sm text-slate-500">
            {locale === "en" ? "Related topics" : "المواضيع ذات الصلة"}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        {keywords?.map((keyword, index) => (
          <motion.span
            key={keyword.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 + index * 0.05 }}
            className="px-4 py-2 rounded-xl bg-linear-to-r from-violet-50 to-purple-50 text-violet-700 font-medium border border-violet-100 hover:shadow-lg hover:shadow-violet-100/50 hover:scale-105 transition-all duration-300 cursor-default"
          >
            #{keyword.title}
          </motion.span>
        ))}
      </div>
    </motion.div>
  );
}
