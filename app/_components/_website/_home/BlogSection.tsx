"use client";

import type React from "react";
import { motion } from "framer-motion";
import { ArticleType } from "@/app/types/_dashboard/GlobalTypes";
import ArticleCard from "../_blog/ArticleCard";
import { directionMap } from "@/app/constants/_website/global";
import { useLocale, useTranslations } from "next-intl";

interface BlogSectionProps {
  articles: ArticleType[];
}

export default function BlogSection({ articles }: BlogSectionProps) {
  const locale = useLocale();
  const t = useTranslations("blog");

  return (
    <section
      dir={directionMap[locale]}
      className="py-16 px-4 c-container bg-white"
    >
      <div className="">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className={`text-center mb-12 rtl:text-right ltr:text-left`}
        >
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 text-balance">
            {t("title")}
          </h2>
          <p className="text-xl text-gray-600 ltr:ml-6 rtl:mr-6 text-pretty">
            {t("subtitle")}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-8">
          {articles &&
            articles
              .slice(0, 8)
              .map((article) => (
                <ArticleCard
                  article={article}
                  key={`${article.id}+${article.title_en}`}
                />
              ))}
        </div>
      </div>
    </section>
  );
}
