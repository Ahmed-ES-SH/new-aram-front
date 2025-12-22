import ArticlesPage from "@/app/_components/_website/_blog/ArticlesPage";
import FetchArticles from "@/app/_components/_website/_blog/fetchArticles";
import HeroBlogSection from "@/app/_components/_website/_blog/HeroBlogSection";
import FetchData from "@/app/_helpers/FetchData";
import { getSharedMetadata } from "@/app/_helpers/helpers";
import { directionMap } from "@/app/constants/_website/global";
import { getTranslations } from "next-intl/server";
import React from "react";

export async function generateMetadata() {
  const t = await getTranslations("metaBlogPage");
  const sharedMetadata = await getSharedMetadata(t("title"), t("description"));
  return {
    title: t("title"),
    description: t("description"),
    ...sharedMetadata,
  };
}

export default async function BlogPage({ params, searchParams }: any) {
  const { locale } = await params;
  const { query, category, tag, page } = await searchParams;

  // main data
  const articlesResponse = await FetchArticles({
    query,
    category,
    tag,
    page,
  });

  // sidebar data

  const categories = await FetchData(`/all-public-article-categories`, false);
  const recentArticles = await FetchData(`/last-three-articles`, false);
  const tags = await FetchData(`/tags?limit=8`, false);

  const { data, pagination } = articlesResponse;

  return (
    <div dir={directionMap[locale]} className="min-h-screen bg-background">
      {/* Hero Section */}
      <HeroBlogSection />
      <ArticlesPage
        recentArticles={recentArticles}
        articles={data}
        tags={tags}
        pagination={pagination}
        categories={categories}
      />
    </div>
  );
}
