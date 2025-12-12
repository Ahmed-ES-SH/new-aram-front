"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { FiEye, FiMessageCircle, FiHeart, FiCalendar } from "react-icons/fi";
import { ArticleType } from "@/app/types/_dashboard/GlobalTypes";
import { useLocale } from "next-intl";

interface ArticleCardProps {
  article: ArticleType;
}

const translations = {
  en: {
    readMore: "Read More",
    views: "Views",
    comments: "Comments",
    reactions: "Reactions",
  },
  ar: {
    readMore: "اقرأ المزيد",
    views: "مشاهدات",
    comments: "تعليقات",
    reactions: "تفاعلات",
  },
};

export default function ArticleCard_V2({ article }: ArticleCardProps) {
  const locale = useLocale();

  const [isHovered, setIsHovered] = useState(false);
  const t = translations[locale];
  const isRTL = locale === "ar";

  const title = isRTL ? article.title_ar : article.title_en;
  const content = isRTL ? article.content_ar : article.content_en;
  const categoryTitle = isRTL
    ? article.category.title_ar
    : article.category.title_en;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(locale === "ar" ? "ar-EG" : "en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + "...";
  };

  return (
    <motion.div
      className="relative h-full bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="relative h-56 overflow-hidden bg-linear-to-br from-blue-500 to-purple-600">
        <motion.img
          src={article.image}
          alt={title}
          className="w-full h-full object-cover"
          animate={{ scale: isHovered ? 1.1 : 1 }}
          transition={{ duration: 0.4 }}
        />

        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent" />

        <motion.div
          className={`absolute top-4 ${isRTL ? "right-4" : "left-4"}`}
          initial={{ x: isRTL ? 20 : -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div
            className="px-4 py-2 rounded-full text-white text-sm font-semibold backdrop-blur-md"
            style={{ backgroundColor: article.category.bg_color || "#3B82F6" }}
          >
            {categoryTitle}
          </div>
        </motion.div>

        <div
          className={`absolute bottom-4 ${
            isRTL ? "right-4" : "left-4"
          } flex items-center gap-3`}
        >
          <img
            src={article.author.image}
            alt={article.author.name}
            className="w-10 h-10 rounded-full border-2 border-white object-cover"
          />
          <div className="text-white">
            <p className="font-semibold text-sm">{article.author.name}</p>
            <div className="flex items-center gap-1 text-xs opacity-90">
              <FiCalendar className="w-3 h-3" />
              <span>{formatDate(article.created_at)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        <motion.h3
          className="text-xl font-bold text-gray-900 mb-3 line-clamp-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {title}
        </motion.h3>

        <motion.p
          className="text-gray-600 text-sm mb-4 line-clamp-3 min-h-[70px] leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {truncateText(content, 150)}
        </motion.p>

        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center gap-4">
            <motion.div
              className="flex items-center gap-1 text-gray-500 text-sm"
              whileHover={{ scale: 1.1 }}
            >
              <FiEye className="w-4 h-4 text-blue-600" />
              <span className="font-medium">
                {article.views.toLocaleString()}
              </span>
            </motion.div>

            <motion.div
              className="flex items-center gap-1 text-gray-500 text-sm"
              whileHover={{ scale: 1.1 }}
            >
              <FiMessageCircle className="w-4 h-4 text-green-600" />
              <span className="font-medium">{article.comments_count}</span>
            </motion.div>

            <motion.div
              className="flex items-center gap-1 text-gray-500 text-sm"
              whileHover={{ scale: 1.1 }}
            >
              <FiHeart className="w-4 h-4 text-red-600" />
              <span className="font-medium">{32}</span>
            </motion.div>
          </div>

          <motion.button
            className="bg-linear-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-full font-semibold text-sm hover:shadow-lg transition-shadow"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {t.readMore}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
