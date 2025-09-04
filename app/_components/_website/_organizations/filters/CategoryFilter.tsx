"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import type { Category } from "@/types/organization"
import { useTranslations } from "next-intl"
import {
  FaChevronDown,
  FaChevronRight,
  FaUtensils,
  FaShoppingBag,
  FaGraduationCap,
  FaHeart,
  FaCar,
  FaHome,
} from "react-icons/fa"

interface CategoryFilterProps {
  categories: Category[]
  selectedCategories: number[]
  onCategoryChange: (categoryIds: number[]) => void
}

const iconMap: { [key: string]: any } = {
  utensils: FaUtensils,
  shopping: FaShoppingBag,
  education: FaGraduationCap,
  health: FaHeart,
  automotive: FaCar,
  home: FaHome,
}

export default function CategoryFilter({ categories, selectedCategories, onCategoryChange }: CategoryFilterProps) {
  const t = useTranslations()
  const [expandedCategories, setExpandedCategories] = useState<number[]>([])

  const toggleCategory = (categoryId: number) => {
    if (selectedCategories.includes(categoryId)) {
      onCategoryChange(selectedCategories.filter((id) => id !== categoryId))
    } else {
      onCategoryChange([...selectedCategories, categoryId])
    }
  }

  const toggleExpanded = (categoryId: number) => {
    if (expandedCategories.includes(categoryId)) {
      setExpandedCategories(expandedCategories.filter((id) => id !== categoryId))
    } else {
      setExpandedCategories([...expandedCategories, categoryId])
    }
  }

  const renderCategory = (category: Category, level = 0) => {
    const IconComponent = iconMap[category.icon_name] || FaHome
    const isExpanded = expandedCategories.includes(category.id)
    const isSelected = selectedCategories.includes(category.id)
    const hasSubcategories = category.subcategories && category.subcategories.length > 0

    return (
      <div key={category.id} className={`${level > 0 ? "ml-4" : ""}`}>
        <motion.div
          whileHover={{ x: 2 }}
          className={`flex items-center p-2 rounded-lg cursor-pointer transition-colors ${
            isSelected
              ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
              : "hover:bg-gray-100 dark:hover:bg-gray-700"
          }`}
        >
          <div className="flex items-center flex-1" onClick={() => toggleCategory(category.id)}>
            <IconComponent className="w-4 h-4 mr-2" />
            <span className="text-sm font-medium">{category.title_en}</span>
          </div>

          {hasSubcategories && (
            <button
              onClick={() => toggleExpanded(category.id)}
              className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
            >
              {isExpanded ? <FaChevronDown className="w-3 h-3" /> : <FaChevronRight className="w-3 h-3" />}
            </button>
          )}
        </motion.div>

        <AnimatePresence>
          {hasSubcategories && isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              {category.subcategories!.map((subcategory) => renderCategory(subcategory, level + 1))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <h3 className="font-semibold text-gray-900 dark:text-white mb-3">{t("categories")}</h3>
      {categories.map((category) => renderCategory(category))}
    </div>
  )
}
