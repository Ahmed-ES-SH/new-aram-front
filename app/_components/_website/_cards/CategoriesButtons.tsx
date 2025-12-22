"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getIconComponent } from "@/app/_helpers/helpers";
import { category } from "@/app/types/_dashboard/GlobalTypes";
import { useLocale } from "next-intl";
import { directionMap } from "@/app/constants/_website/global";
import { useRouter, useSearchParams } from "next/navigation";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

interface Props {
  categories: category[];
}

export default function CategoriesButtons({ categories }: Props) {
  const [showAll, setShowAll] = useState(false);
  const locale = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();

  const activeCatgeory = searchParams.get("category_id") ?? null;

  // helper: handle category select
  const handleSelectCategory = (catId: number | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (catId) {
      params.set("category_id", String(catId));
    } else {
      params.delete("category_id");
    }
    router.push(`?${params.toString()}`);
  };

  const visibleCategories = showAll ? categories : categories.slice(0, 7);

  return (
    <div dir={directionMap[locale]} className="w-full max-w-6xl mx-auto mb-8">
      <div className="flex flex-wrap items-center justify-center gap-3">
        {/* Show All Button */}
        <button
          onClick={() => handleSelectCategory(null)}
          className={`
            px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300
            ${
              !activeCatgeory
                ? "bg-primary text-white shadow-lg shadow-primary/25 scale-105"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900"
            }
          `}
        >
          {locale === "en" ? "All Cards" : "جميع البطاقات"}
        </button>

        {/* Categories */}
        <AnimatePresence mode="popLayout">
          {visibleCategories.map((cat) => {
            const Icon = getIconComponent(cat.icon_name);
            const isActive = cat.id == Number(activeCatgeory);
            return (
              <motion.button
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                key={cat.id}
                onClick={() => handleSelectCategory(cat.id)}
                className={`
                  flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 border
                  ${
                    isActive
                      ? "bg-primary text-white border-primary shadow-lg shadow-primary/25 scale-105"
                      : "bg-white text-gray-600 border-gray-200 hover:border-primary/50 hover:text-primary hover:bg-primary/5"
                  }
                `}
              >
                {Icon && <Icon className="text-lg" />}
                <span>{locale === "en" ? cat.title_en : cat.title_ar}</span>
              </motion.button>
            );
          })}
        </AnimatePresence>

        {/* Toggle Show More/Less */}
        {categories.length > 7 && (
          <button
            onClick={() => setShowAll(!showAll)}
            className="flex items-center gap-1 px-4 py-2 rounded-full text-sm font-medium text-primary hover:bg-primary/5 transition-colors duration-300"
          >
            <span>
              {showAll
                ? locale === "en"
                  ? "Show Less"
                  : "عرض أقل"
                : locale === "en"
                ? "Show More"
                : "عرض المزيد"}
            </span>
            {showAll ? <FaChevronUp /> : <FaChevronDown />}
          </button>
        )}
      </div>
    </div>
  );
}
