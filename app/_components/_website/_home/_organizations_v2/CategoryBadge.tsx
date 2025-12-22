// components/centers/CategoryBadge.tsx
"use client";
import React from "react";
import { motion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import IconLoader from "./IconLoader";

interface CategoryBadgeProps {
  category: {
    title_en: string;
    title_ar: string;
    bg_color: string;
    icon_name: string;
  };
}

const CategoryBadge: React.FC<CategoryBadgeProps> = ({ category }) => {
  const locale = useLocale();
  const t = useTranslations("Common");

  const getTitle = () => {
    return locale === "ar" ? category.title_ar : category.title_en;
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      whileHover={{ scale: 1.05, rotate: 2 }}
      style={{ backgroundColor: category.bg_color + "15" }}
      className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl 
                 border border-opacity-20 backdrop-blur-sm"
    >
      <div
        className="p-2 rounded-full"
        style={{ backgroundColor: category.bg_color }}
      >
        <IconLoader
          iconName={category.icon_name}
          className="w-4 h-4 text-white"
        />
      </div>
      <span
        className="text-sm font-semibold"
        style={{ color: category.bg_color }}
      >
        {getTitle()}
      </span>
    </motion.div>
  );
};

export default CategoryBadge;
