"use client";

import React from "react";
import { motion } from "framer-motion";
import { FaBuilding } from "react-icons/fa";
import { category } from "@/app/types/_dashboard/GlobalTypes";
import { getIconComponent } from "@/app/_helpers/helpers";
import { useLocale, useTranslations } from "next-intl";

interface Props {
  category: category;
  onClick?: () => void;
}

export default function CategoryOrgCard({ category, onClick }: Props) {
  const locale = useLocale();
  const t = useTranslations("organizationPage.categoryCard");
  const Icon = getIconComponent(category.icon_name);

  return (
    <motion.div
      onClick={onClick}
      whileHover={{ scale: 1.05, y: -5 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="group relative flex flex-col items-center justify-center p-6 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-primary/20 cursor-pointer transition-all duration-300 h-[200px]"
    >
      {/* Icon Circle */}
      <div className="mb-4 p-4 rounded-full bg-gray-50 text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300">
        {Icon ? (
          <Icon className="text-3xl" />
        ) : (
          <FaBuilding className="text-3xl" />
        )}
      </div>

      {/* Title */}
      <h3 className="text-lg font-bold text-gray-800 text-center mb-2 group-hover:text-primary transition-colors duration-300">
        {locale === "en" ? category.title_en : category.title_ar}
      </h3>

      {/* Count Badge */}
      <div className="flex items-center gap-1.5 text-xs font-medium text-gray-500 bg-gray-50 px-3 py-1 rounded-full group-hover:bg-primary/5 group-hover:text-primary transition-colors duration-300">
        <FaBuilding className="text-xs" />
        <span className="flex items-center gap-1">
          <p className="text-xs font-medium">
            {category.parent_id
              ? locale === "en"
                ? "Organizations"
                : "المراكز"
              : locale === "en"
              ? "Sub Categories"
              : "الاقسام الفرعية"}
          </p>
          <p className="text-xs font-medium">
            {category.parent_id
              ? category.organizations_count
              : category.sub_categories_count}
          </p>
        </span>
      </div>
    </motion.div>
  );
}
