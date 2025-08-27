"use client";
import { ArticleType } from "@/app/types/_dashboard/GlobalTypes";
import React from "react";
import { FiEye, FiCalendar, FiArrowRight } from "react-icons/fi";
import { motion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import Img from "../_global/Img";

interface props {
  article: ArticleType;
  index: number;
}

export default function ArticleCard({ article, index }: props) {
  const locale = useLocale();
  const t = useTranslations("blog");

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(locale === "ar" ? "ar-SA" : "en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getTitle = (article: ArticleType) => {
    return locale === "ar" ? article.title_ar : article.title_en;
  };

  const getExcerpt = (article: ArticleType) => {
    const content = locale === "ar" ? article.content_ar : article.content_en;
    return content.length > 150 ? content.substring(0, 150) + "..." : content;
  };

  return (
    <>
      <motion.article
        key={article.id}
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        viewport={{ once: true }}
        whileHover={{ y: -8 }}
        className="bg-white rounded-xl shadow-lg h-full overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300"
      >
        <div className="relative">
          <Img
            src={article.image || "/placeholder.png"}
            alt={getTitle(article)}
            className="w-full h-48 object-cover"
          />
          <div className="absolute top-4 right-4">
            <div
              className="px-3 py-1 rounded-full text-xs font-medium text-white"
              style={{ backgroundColor: article.category.bg_color }}
            >
              {locale === "ar"
                ? article.category.title_ar
                : article.category.title_en}
            </div>
          </div>
        </div>

        <div className="p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-3 text-balance leading-tight">
            {getTitle(article)}
          </h3>

          <p className="text-gray-600 text-sm mb-4 leading-relaxed">
            {getExcerpt(article)}
          </p>

          <div className="flex items-center gap-4 mb-4 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <FiEye className="w-4 h-4" />
              <span>
                {article.views.toLocaleString()} {t("views")}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <FiCalendar className="w-4 h-4" />
              <span>{formatDate(article.created_at)}</span>
            </div>
          </div>

          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Img
                src={article.author.image || "/placeholder.png"}
                alt={article.author.name}
                className="w-8 h-8 rounded-full"
              />
              <div className="text-sm">
                <span className="text-gray-500">{t("by")} </span>
                <span className="text-gray-700 font-medium">
                  {article.author.name}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>{article.comments_count} comments</span>
              <span>•</span>
              <span>
                {article.interactions[0]?.totalReactions || 0} reactions
              </span>
            </div>
          </div>

          <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 group">
            {t("readMore")}
            <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
          </button>
        </div>
      </motion.article>
    </>
  );
}
