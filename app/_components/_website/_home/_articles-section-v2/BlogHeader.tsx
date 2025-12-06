"use client";

import type React from "react";
import { motion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { FaPenNib, FaArrowRight, FaStar } from "react-icons/fa";
import { directionMap } from "@/app/constants/_website/global";

const BlogHeader: React.FC = () => {
  const locale = useLocale();
  const t = useTranslations("articles_section");
  const isRTL = directionMap[locale] === "rtl";

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      viewport={{ once: true, margin: "-50px" }}
      className="relative mb-16 overflow-hidden"
    >
      {/* خلفية زخرفية */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.1 }}
          transition={{ duration: 1.2, delay: 0.3 }}
          className="absolute -top-20 -right-20 w-64 h-64 rounded-full"
          style={{
            background: "radial-gradient(circle, #feb803 0%, transparent 70%)",
          }}
        />
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.1 }}
          transition={{ duration: 1.2, delay: 0.5 }}
          className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full"
          style={{
            background: "radial-gradient(circle, #feb803 0%, transparent 70%)",
          }}
        />
      </div>

      <div className="relative">
        {/* شارة مميزة */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex items-center justify-center mb-8"
        >
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-linear-to-r from-yellow-400 to-yellow-500 flex items-center justify-center">
              <FaPenNib className="w-8 h-8 text-white" />
            </div>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 rounded-full border-2 border-dashed border-yellow-300"
            />
          </div>
        </motion.div>

        {/* العنوان الرئيسي مع تأثير */}
        <div className="relative mb-6">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-4xl lg:text-5xl xl:text-6xl font-bold text-center mb-4 text-gray-900 leading-tight"
          >
            <span className="relative inline-block">
              {t("title")}
              <motion.span
                initial={{ width: 0 }}
                whileInView={{ width: "100%" }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="absolute bottom-0 left-0 h-1 bg-linear-to-r from-transparent via-yellow-400 to-transparent"
              />
            </span>
          </motion.h2>

          {/* النجوم الزخرفية */}
          <div className="flex justify-center gap-4 mt-6">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.4 + i * 0.1 }}
              >
                <FaStar className="w-6 h-6 text-yellow-400" />
              </motion.div>
            ))}
          </div>
        </div>

        {/* العنوان الفرعي مع زر مميز */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex flex-col lg:flex-row items-center justify-center gap-6"
        >
          <p className="text-xl lg:text-2xl text-gray-700 text-center max-w-3xl">
            {t("subtitle")}
          </p>

          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="group relative"
          >
            <div className="absolute inset-0 rounded-lg bg-linear-to-r from-yellow-400 to-yellow-500 opacity-0 group-hover:opacity-100 blur transition-opacity duration-300" />
            <button
              className="relative flex items-center gap-3 px-6 py-3 rounded-lg bg-linear-to-r from-yellow-400 to-yellow-500 text-white font-semibold shadow-lg hover:shadow-xl transition-shadow duration-300"
              onClick={() => {
                // إضافة وظيفة التنقل هنا
                const blogSection = document.getElementById("articles-slider");
                blogSection?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              <span>{t("viewAll") || "عرض الكل"}</span>
              <motion.div
                animate={{ x: isRTL ? [-3, 3, -3] : [3, -3, 3] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <FaArrowRight
                  className={`w-5 h-5 ${isRTL ? "rotate-180" : ""}`}
                />
              </motion.div>
            </button>
          </motion.div>
        </motion.div>

        {/* خط فاصل متحرك */}
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: "100%" }}
          transition={{ duration: 1, delay: 0.7 }}
          className="mt-12 h-px bg-linear-to-r from-transparent via-yellow-300 to-transparent"
        />
      </div>
    </motion.div>
  );
};

export default BlogHeader;
