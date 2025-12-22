"use client";

import { motion } from "framer-motion";
import ArticleCard from "./article-card";
import { Article } from "./types";
import { useTranslations } from "next-intl";

interface ArticlesListProps {
  articles: Article[];
}

export default function ArticlesList({ articles }: ArticlesListProps) {
  const t = useTranslations("articles");

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  if (articles.length === 0) {
    return (
      <div className="text-center min-h-[70vh] flex items-center justify-center py-12">
        <div className="">
          <div className="text-6xl mb-4">📝</div>
          <h3 className="text-xl font-semibold text-foreground mb-2">
            {t("noArticles")}
          </h3>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6"
    >
      {articles.map((article, index) => (
        <ArticleCard
          key={`${article.id}+${article.title_en}+${index}`}
          article={article}
          index={index}
        />
      ))}
    </motion.div>
  );
}
