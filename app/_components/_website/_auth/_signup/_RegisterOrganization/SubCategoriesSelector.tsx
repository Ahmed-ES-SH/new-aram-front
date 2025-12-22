"use client";

import { motion, AnimatePresence } from "framer-motion";
import { FaCheck, FaInfoCircle } from "react-icons/fa";
import { useTranslations } from "next-intl";
import { category } from "@/app/types/_dashboard/GlobalTypes";

interface SubCategoriesSelectorProps {
  categories: category[]; // جاي من الـ API
  selectedCategories: number[];
  selectedSubcategories: number[];
  onChange: (subcategories: number[]) => void;
  locale: "en" | "ar";
}

export function SubCategoriesSelector({
  categories,
  selectedCategories,
  selectedSubcategories,
  onChange,
  locale,
}: SubCategoriesSelectorProps) {
  const t = useTranslations("registration");

  const toggleSubcategory = (subcategoryId: number) => {
    if (selectedSubcategories.includes(subcategoryId)) {
      onChange(selectedSubcategories.filter((id) => id !== subcategoryId));
    } else {
      onChange([...selectedSubcategories, subcategoryId]);
    }
  };

  if (selectedCategories.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3 p-4 rounded-lg border border-border bg-muted/30"
      >
        <FaInfoCircle className="w-5 h-5 text-muted-foreground flex-shrink-0" />
        <p className="text-sm text-muted-foreground">
          {t("subCategoriesMessage")}
        </p>
      </motion.div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={selectedCategories.join(",")}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3 }}
        className="space-y-4"
      >
        {categories
          .filter((cat) => selectedCategories.includes(cat.id))
          .map((category) => (
            <div key={category.id} className="space-y-2">
              <h4 className="text-sm font-medium text-foreground">
                {locale === "ar" ? category.title_ar : category.title_en}
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {category.sub_categories &&
                  category.sub_categories.map((subcategory) => {
                    const isSelected = selectedSubcategories.includes(
                      subcategory.id
                    );

                    return (
                      <motion.button
                        key={subcategory.id}
                        type="button"
                        onClick={() => toggleSubcategory(subcategory.id)}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`
                        relative px-3 py-2 rounded-lg border text-sm transition-all duration-200
                        focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1
                        ${
                          isSelected
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-input bg-background text-foreground hover:border-primary/50"
                        }
                      `}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="truncate">
                            {locale === "ar"
                              ? subcategory.title_ar
                              : subcategory.title_en}
                          </span>
                          <motion.div
                            initial={false}
                            animate={{
                              scale: isSelected ? 1 : 0,
                              opacity: isSelected ? 1 : 0,
                            }}
                            transition={{
                              type: "spring",
                              stiffness: 500,
                              damping: 30,
                            }}
                          >
                            <FaCheck className="w-3 h-3 flex-shrink-0" />
                          </motion.div>
                        </div>
                      </motion.button>
                    );
                  })}
              </div>
            </div>
          ))}
      </motion.div>
    </AnimatePresence>
  );
}
