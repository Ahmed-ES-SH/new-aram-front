"use client";

import BlogSidebar from "@/app/_components/_website/_blog/BlogSidebar";
import ArticlesList from "@/app/_components/_website/_blog/ArticlesList";
import { Article, Category, tag } from "./types";
import ServerPagination from "../_global/ServerPagination";
import { useTranslations } from "next-intl";

interface props {
  articles: Article[];
  recentArticles: Article[];
  categories: Category[];
  tags: tag[];
  pagination: {
    current_page: number;
    last_page: number;
  };
}

export default function ArticlesPage({
  articles,
  recentArticles,
  categories,
  pagination,
  tags,
}: props) {
  const t = useTranslations("articles.list");

  return (
    <>
      {/* Main Content */}
      <section id="articles-section" className="py-12">
        <div className="c-container">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Articles List */}
            <div className="lg:col-span-3">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  {t("title")}
                </h2>
                <p className="text-muted-foreground">{t("subtitle")}</p>
              </div>

              <ArticlesList articles={articles} />
              {pagination && pagination.last_page > 1 && (
                <ServerPagination
                  currentPage={pagination.current_page}
                  totalPages={pagination.last_page}
                />
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <BlogSidebar
                recentArticles={recentArticles}
                categories={categories}
                tags={tags}
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
