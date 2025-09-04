"use client"

import { motion } from "framer-motion"
import { FaStar } from "react-icons/fa"
import { useTranslations } from "next-intl"

interface RatingFilterProps {
  selectedRating: number | null
  onRatingChange: (rating: number | null) => void
}

export default function RatingFilter({ selectedRating, onRatingChange }: RatingFilterProps) {
  const t = useTranslations()

  const ratings = [5, 4, 3, 2, 1]

  return (
    <div className="space-y-2">
      <h3 className="font-semibold text-gray-900 dark:text-white mb-3">{t("rating")}</h3>

      <div className="space-y-2">
        <motion.button
          whileHover={{ x: 2 }}
          onClick={() => onRatingChange(null)}
          className={`flex items-center w-full p-2 rounded-lg text-left transition-colors ${
            selectedRating === null
              ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
              : "hover:bg-gray-100 dark:hover:bg-gray-700"
          }`}
        >
          <span className="text-sm">{t("all_ratings")}</span>
        </motion.button>

        {ratings.map((rating) => (
          <motion.button
            key={rating}
            whileHover={{ x: 2 }}
            onClick={() => onRatingChange(rating)}
            className={`flex items-center w-full p-2 rounded-lg text-left transition-colors ${
              selectedRating === rating
                ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
                : "hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
          >
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <FaStar
                  key={i}
                  className={`w-3 h-3 mr-1 ${i < rating ? "text-yellow-400" : "text-gray-300 dark:text-gray-600"}`}
                />
              ))}
              <span className="text-sm ml-1">{t("and_up")}</span>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  )
}
