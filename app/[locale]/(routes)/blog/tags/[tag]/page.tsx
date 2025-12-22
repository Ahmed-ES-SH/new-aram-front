import ArticlesList from "@/app/_components/_website/_blog/ArticlesList";
import BlogSidebar from "@/app/_components/_website/_blog/BlogSidebar";
import ServerPagination from "@/app/_components/_website/_global/ServerPagination";
import FetchData from "@/app/_helpers/FetchData";
import { getSharedMetadata } from "@/app/_helpers/helpers";
import { directionMap } from "@/app/constants/_website/global";
import { getTranslations } from "next-intl/server";
import React from "react";

export async function generateMetadata() {
  const t = await getTranslations("metaTagArticlesPage");
  const sharedMetadata = await getSharedMetadata(t("title"), t("description"));
  return {
    title: t("title"),
    description: t("description"),
    ...sharedMetadata,
  };
}

export default async function TagArticles({ searchParams, params }: any) {
  const { locale, tag } = await params;
  const { tagId, category } = await searchParams;

  const t = await getTranslations("articles.list");

  //  main data
  const api = category
    ? `/articles-by-tag?tag_id=${tagId}&category=${category}`
    : `/articles-by-tag?tag_id=${tagId}`;

  const articlesResponse = await FetchData(api, true);
  const { articles, pagination } = articlesResponse.data;

  // sidebar data

  const categories = await FetchData(`/all-public-article-categories`, false);
  const recentArticles = await FetchData(`/last-three-articles`, false);
  const tags = await FetchData(`/tags?limit=8`, false);

  return (
    <div dir={directionMap[locale]} className="min-h-screen bg-background">
      <section id="articles-by-tag-section" className="py-12 mt-20">
        <div className="c-container">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Articles List */}
            <div className="lg:col-span-3">
              <div className="mb-6">
                <h2 className="text-2xl font-semibold flex items-center gap-1 text-foreground mb-2">
                  {`${t("title")} ${locale == "ar" ? "ذات الوسم" : "by tag"} `}
                  <span className="underline font-bold text-primary">
                    {tag}
                  </span>
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
    </div>
  );
}
