"use client";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Article } from "./types";
import { useLocale } from "next-intl";
import { LiaSpinnerSolid } from "react-icons/lia";
import { TbArticleOff } from "react-icons/tb";
import { FiCalendar, FiEye } from "react-icons/fi";
import { format } from "date-fns";
import { enUS, ar } from "date-fns/locale";
import Img from "../_global/Img";

interface props {
  articles: Article[];
  loading: boolean;
  isOpen: boolean;
}

export default function SearchResultes({ articles, loading, isOpen }: props) {
  const locale = useLocale();
  const loadingMessage = locale == "en" ? "loading..." : "بحث ....";
  const noArticles =
    locale == "en"
      ? "No Articles Found"
      : "لم يتم العثور على اى مقالات تطابق بيانات البجث";

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "d MMM", {
      locale: locale === "ar" ? ar : enUS,
    });
  };

  const renderData = () => {
    if (loading) {
      return (
        <div className="w-full h-full flex items-center justify-center">
          <div className="flex flex-col gap-4">
            <LiaSpinnerSolid className="size-16 text-primary animate-spin" />
            <p className="text-gray-500">{loadingMessage}</p>
          </div>
        </div>
      );
    }

    if (articles && articles.length == 0) {
      return (
        <div className="w-full h-full flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <TbArticleOff className="lg:size-24 size-16 text-red-400" />
            <p className="text-gray-500">{noArticles}</p>
          </div>
        </div>
      );
    }

    if (articles && articles.length > 0) {
      return articles.map((article) => (
        <div key={article.id} className="flex gap-3 group cursor-pointer">
          <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
            <Img
              src={article.image || "/placeholder.svg"}
              errorSrc="/defaults/noImage.png"
              alt={locale === "ar" ? article.title_ar : article.title_en}
              className="object-cover transition-transform duration-300 group-hover:scale-110"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-sm text-card-foreground line-clamp-2 group-hover:text-primary transition-colors duration-200">
              {locale === "ar" ? article.title_ar : article.title_en}
            </h4>
            <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <FiCalendar className="w-3 h-3" />
                <span>{formatDate(article.created_at)}</span>
              </div>
              <div className="flex items-center gap-1">
                <FiEye className="w-3 h-3" />
                <span>{article.views}</span>
              </div>
            </div>
          </div>
        </div>
      ));
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="top-[105%] left-1/2 -translate-x-1/2 absolute h-72 overflow-y-auto w-full bg-white border border-gray-300 rounded-md shadow-lg p-2"
        >
          {renderData()}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
