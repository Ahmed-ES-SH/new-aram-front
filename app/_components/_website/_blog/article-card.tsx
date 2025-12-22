"use client";

import { motion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { FiEye, FiCalendar, FiArrowRight, FiArrowLeft } from "react-icons/fi";
import { Article } from "./types";
import Img from "../_global/Img";
import LocaleLink from "../_global/LocaleLink";
import { formatTitle } from "@/app/_helpers/helpers";

interface ArticleCardProps {
  article: Article;
  index?: number;
}

export default function ArticleCard({ article, index = 0 }: ArticleCardProps) {
  const locale = useLocale();
  const t = useTranslations("articles.article");

  const title = locale === "ar" ? article.title_ar : article.title_en;
  const content = locale === "ar" ? article.content_ar : article.content_en;
  const categoryTitle =
    locale === "ar" ? article.category.title_ar : article.category.title_en;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(locale === "ar" ? "ar-SA" : "en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const truncateContent = (text: string, maxLength = 120) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      whileHover={{ y: -5 }}
      className="bg-card rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group"
    >
      {/* Article Image */}
      <div className="relative h-48 overflow-hidden">
        <Img
          src={article.image ?? "/defaults/noImage.png"}
          errorSrc="/defaults/noImage.png"
          alt={title}
          className="object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Category Badge */}
        <div className="absolute top-4 left-4">
          <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
            {categoryTitle}
          </span>
        </div>
      </div>

      {/* Article Content */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-card-foreground mb-3 line-clamp-2 group-hover:text-primary transition-colors duration-300">
          {title}
        </h3>

        <p className="text-muted-foreground mb-4 line-clamp-3 text-sm leading-relaxed">
          {truncateContent(content)}
        </p>

        {/* Tags Section */}
        {article.tags && article.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {article.tags.slice(0, 4).map((tag) => (
              <LocaleLink
                href={`/blog/tags/${formatTitle(tag.tag)}?tagId=${tag.id}`}
                key={tag.id}
                className="px-3 py-1 text-xs rounded-full hover:scale-105 hover:bg-orange-500 duration-300 bg-primary text-primary-foreground  cursor-pointer"
              >
                {tag.tag}
              </LocaleLink>
            ))}
          </div>
        )}

        {/* Article Meta */}
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-4">
            {/* Author */}
            <div className="flex items-center gap-2">
              <div className="relative w-6 h-6 rounded-full overflow-hidden">
                <Img
                  src={article.author.image ?? "/defaults/noImage.png"}
                  errorSrc="/defaults/noImage.png"
                  alt={article.author.name}
                  className="object-cover"
                />
              </div>
              <span className="text-xs">
                {t("by")} {article.author.name}
              </span>
            </div>

            {/* Date */}
            <div className="flex items-center gap-1">
              <FiCalendar className="w-3 h-3" />
              <span className="text-xs">{formatDate(article.created_at)}</span>
            </div>
          </div>

          {/* Views */}
          <div className="flex items-center gap-1">
            <FiEye className="w-4 h-4" />
            <span className="text-xs">
              {article.views.toLocaleString()} {t("views")}
            </span>
          </div>
        </div>

        {/* Read More Button */}
        <LocaleLink
          href={`/blog/articles/${formatTitle(
            article?.title_en || "title not found"
          )}?articleId=${article?.id}`}
          className="mt-4 pt-4 border-t border-border"
        >
          <button className="text-primary hover:text-orange-500 font-medium text-sm transition-colors duration-300 flex items-center gap-1 group">
            <p>{t("readMore")}</p>
            <motion.span className="rtl:group-hover:-translate-x-1 ltr:group-hover:translate-x-1 duration-200">
              {locale == "en" ? <FiArrowRight /> : <FiArrowLeft />}
            </motion.span>
          </button>
        </LocaleLink>
      </div>
    </motion.article>
  );
}
