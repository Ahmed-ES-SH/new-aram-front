"use client";

import React from "react";
import { motion } from "framer-motion";
import { FaSitemap, FaBuilding } from "react-icons/fa";
import { category } from "@/app/types/_dashboard/GlobalTypes";
import { getIconComponent } from "@/app/_helpers/helpers";
import { useLocale, useTranslations } from "next-intl";
import Img from "../_global/Img";

interface Props {
  category: category;
}

export default function CategoryOrgCard({ category }: Props) {
  const locale = useLocale();
  const t = useTranslations("organizationPage.categoryCard");
  const Icon = getIconComponent(category.icon_name);

  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      className="rounded-2xl overflow-hidden cursor-pointer border border-gray-200 hover:border-primary duration-300 shadow-sm hover:shadow-md bg-white flex flex-col"
    >
      {/* Image Section (3/4) */}
      <div className="relative w-full h-52">
        <Img
          src={category.image ?? "/defaults/noImage.png"}
          errorSrc="/defaults/noImage.png"
          alt={locale === "en" ? category.title_en : category.title_ar}
          className="object-cover w-full h-full"
        />

        {/* Icon Overlay */}
        <div
          className="absolute top-3 left-3 p-2 rounded-lg shadow"
          style={{ backgroundColor: category.bg_color }}
        >
          {Icon && <Icon className="text-white text-lg" />}
        </div>
      </div>

      {/* Info Section (1/4) */}
      <div className="flex-1 p-4 flex flex-col justify-between">
        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-800 mb-3 line-clamp-1">
          {locale === "en" ? category.title_en : category.title_ar}
        </h3>

        {/* Stats */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Subcategories */}
          {!category.parent && (
            <div className="flex items-center gap-2 px-3 py-1 border border-gray-400 rounded-lg bg-gray-50 text-gray-700 text-xs">
              <FaSitemap className="text-primary" />
              <span>
                {t("subcategories_count", {
                  count: category.sub_categories_count,
                })}
              </span>
            </div>
          )}

          {/* Organizations */}
          {category.organizations_count > 0 ? (
            <div className="flex items-center gap-2 px-3 py-1 border border-gray-400 rounded-lg bg-gray-50 text-gray-700 text-xs">
              <FaBuilding className="text-green-600" />
              <span>
                {t("organizations_count", {
                  count: category.organizations_count,
                })}
              </span>
            </div>
          ) : (
            <div className="text-xs text-red-500 font-medium mt-1">
              {t("no_organizations")}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
