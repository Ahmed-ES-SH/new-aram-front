"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import CategoryCard from "./CategoryBlogCard";
import { mockCategories } from "./mock-data";

interface CategoriesSectionProps {
  onCategorySelect?: (categoryId: number | null) => void;
  selectedCategory?: number | null;
}

export default function CategoriesSection({
  onCategorySelect,
  selectedCategory,
}: CategoriesSectionProps) {
  const t = useTranslations("articles.categories");

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <section className="py-12 bg-secondary/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h2 className="text-3xl font-bold text-foreground mb-4">
            {t("title")}
          </h2>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {/* All Categories Card */}
          <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
            onClick={() => onCategorySelect?.(null)}
            className={`bg-card rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer min-w-[200px] flex-shrink-0 border-2 ${
              selectedCategory === null
                ? "border-primary"
                : "border-transparent"
            }`}
          >
            <div className="relative h-32 overflow-hidden bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <div className="text-white text-4xl">📚</div>
            </div>

            <div className="p-4">
              <h3 className="font-semibold text-card-foreground text-center">
                {t("all")}
              </h3>
            </div>
          </motion.div>

          {/* Category Cards */}
          {mockCategories.map((category) => (
            <motion.div
              key={category.id}
              variants={itemVariants}
              className={`border-2 rounded-lg transition-all duration-300 ${
                selectedCategory === category.id
                  ? "border-primary"
                  : "border-transparent"
              }`}
            >
              <CategoryCard
                category={category}
                onClick={() => onCategorySelect?.(category.id)}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
