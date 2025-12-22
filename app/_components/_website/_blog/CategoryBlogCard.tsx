"use client";

import { motion } from "framer-motion";
import { useLocale } from "next-intl";
import { Category } from "./types";
import Img from "../_global/Img";

interface CategoryCardProps {
  category: Category;
  onClick?: () => void;
}

export default function CategoryCard({ category, onClick }: CategoryCardProps) {
  const locale = useLocale();
  const title = locale === "ar" ? category.title_ar : category.title_en;

  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -5 }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.2 }}
      onClick={onClick}
      className="bg-card rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer min-w-[200px] flex-shrink-0"
    >
      <div className="relative h-32 overflow-hidden">
        <Img
          src={category.image}
          errorSrc="/defaults/noImage.png"
          alt={title}
          className="object-cover transition-transform duration-300 hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-card-foreground text-center">
          {title}
        </h3>
      </div>
    </motion.div>
  );
}
