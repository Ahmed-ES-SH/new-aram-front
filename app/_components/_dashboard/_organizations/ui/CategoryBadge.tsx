"use client";

import { Category } from "../types/organization";

interface CategoryBadgeProps {
  category: Category;
}

export function CategoryBadge({ category }: CategoryBadgeProps) {
  return (
    <span
      className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-white"
      style={{ backgroundColor: category.bg_color }}
    >
      {category.title_en}
    </span>
  );
}
