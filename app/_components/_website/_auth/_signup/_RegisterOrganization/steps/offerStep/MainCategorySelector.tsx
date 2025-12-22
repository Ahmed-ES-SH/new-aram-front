"use client";
import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { getIconComponent } from "@/app/_helpers/helpers";
import { category } from "@/app/types/_dashboard/GlobalTypes";
import { MdErrorOutline } from "react-icons/md";

interface Props {
  categories: category[];
  selectedCategory: string | number | null;
  onChange: (id: number) => void;
  locale: "en" | "ar";
  error: string;
}

export default function MainCategorySelector({
  categories,
  selectedCategory,
  onChange,
  locale,
  error,
}: Props) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-foreground">
        {locale === "ar" ? "الفئة الرئيسية" : "Main Category"}
      </label>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          const Icon = getIconComponent(cat.icon_name);
          return (
            <motion.button
              key={cat.id}
              type="button"
              onClick={() => onChange(cat.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`p-3 flex items-center gap-1 rounded-lg border transition-all ${
                isSelected
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-background border-input hover:border-primary/50"
              }`}
            >
              <Icon className="w-4 h-4" />
              {locale === "ar" ? cat.title_ar : cat.title_en}
            </motion.button>
          );
        })}
      </div>
      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.div
            className="flex items-center gap-1 text-red-500 text-sm mt-2"
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.3 }}
          >
            <MdErrorOutline className="size-4" />
            <span>{error}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
