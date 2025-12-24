"use client";
import { ArticleType } from "@/app/types/_dashboard/GlobalTypes";
import React from "react";
import { FiEye, FiCalendar, FiArrowRight } from "react-icons/fi";
import { useLocale, useTranslations } from "next-intl";
import Img from "../_global/Img";
import LocaleLink from "../_global/LocaleLink";
import { formatTitle } from "@/app/_helpers/helpers";

interface props {
  article: ArticleType;
}

export default function ArticleCard({ article }: props) {
  const locale = useLocale();
  const t = useTranslations("blog");

  // Format date based on locale
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(locale === "ar" ? "ar-SA" : "en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Get localized title
  const getTitle = (article: ArticleType) => {
    return locale === "ar" ? article.title_ar : article.title_en;
  };

  // Get localized excerpt
  const getExcerpt = (article: ArticleType) => {
    const content = locale === "ar" ? article.content_ar : article.content_en;
    return content.length > 150 ? content.substring(0, 150) + "..." : content;
  };

  return (
    <article
      key={article.id}
      className="bg-white rounded-xl shadow-lg h-full lg:min-h-[490px] pb-4 overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1"
    >
      {/* Article Image & Category */}
      <div className="relative">
        <Img
          src={article.image ?? "/defaults/noImage.png"}
          errorSrc="/defaults/noImage.png"
          alt={getTitle(article)}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-4 right-4">
          <div className="px-3 py-1 bg-primary rounded-full text-xs font-medium text-white">
            {locale === "ar"
              ? article.category.title_ar
              : article.category.title_en}
          </div>
        </div>
      </div>

      {/* Article Content */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-3 text-balance leading-tight">
          {getTitle(article)}
        </h3>

        <p className="text-gray-600 min-h-[70px] text-sm mb-4 leading-relaxed">
          {getExcerpt(article)}
        </p>

        {/* Views & Date */}
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

        {/* Author */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Img
              src={article.author.image ?? "/defaults/male-noimage.jpg"}
              errorSrc="/defaults/male-noimage.jpg"
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
        </div>

        {/* Read More Button */}
        <LocaleLink
          href={`/blog/articles/${formatTitle(
            article?.title_en || "title not found"
          )}?articleId=${article?.id}`}
          className="w-full bg-gray-100 hover:bg-primary hover:text-white text-gray-700 font-medium py-3 
                     duration-300 pt-auto px-4 rounded-lg transition-colors flex items-center justify-center gap-2 group"
        >
          {t("readMore")}
          <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </LocaleLink>
      </div>
    </article>
  );
}
