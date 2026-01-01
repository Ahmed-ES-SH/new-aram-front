"use client";

import { motion } from "framer-motion";
import { FaCheck } from "react-icons/fa";
import { category } from "@/app/types/_dashboard/GlobalTypes";
import { getIconComponent } from "@/app/_helpers/helpers";

interface CategoriesSelectorProps {
  categories: category[]; // جاي من الـ API بالشكل الجديد
  selectedCategories: number[];
  onChange: (categories: number[]) => void;
  locale: "en" | "ar";
}

export function CategoriesSelector({
  categories,
  selectedCategories,
  onChange,
  locale,
}: CategoriesSelectorProps) {
  const toggleCategory = (categoryId: number) => {
    if (selectedCategories.includes(categoryId)) {
      onChange(selectedCategories.filter((id) => id !== categoryId));
    } else {
      onChange([...selectedCategories, categoryId]);
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {categories && Array.isArray(categories) && categories.length > 0 ? (
        categories.map((category) => {
          const isSelected =
            selectedCategories &&
            Array.isArray(selectedCategories) &&
            selectedCategories.includes(category.id);

          const Icon = getIconComponent(category.icon_name);

          return (
            <motion.button
              key={category.id}
              type="button"
              onClick={() => toggleCategory(category.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`
              relative p-4 rounded-lg border-2 text-left transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2
              ${
                isSelected
                  ? "border-primary bg-primary/10 text-foreground"
                  : "border-input bg-background text-foreground hover:border-primary/50"
              }
            `}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <Icon className="size-4" />
                  <span className="font-medium">
                    {locale === "ar" ? category.title_ar : category.title_en}
                  </span>
                </div>
                <motion.div
                  initial={false}
                  animate={{
                    scale: isSelected ? 1 : 0,
                    opacity: isSelected ? 1 : 0,
                  }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground"
                >
                  <FaCheck className="w-3 h-3" />
                </motion.div>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {category?.sub_categories_count ?? 0}{" "}
                {locale === "ar" ? "تصنيف فرعي" : "subcategories"}
              </p>
            </motion.button>
          );
        })
      ) : (
        <p className="text-center text-muted-foreground">No categories found</p>
      )}
    </div>
  );
}
