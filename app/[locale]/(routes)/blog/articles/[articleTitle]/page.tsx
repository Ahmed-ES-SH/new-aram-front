import ArticlePageComponent from "@/app/_components/_website/_blog/articlePage/ArticlePageComponent";
import FetchData from "@/app/_helpers/FetchData";
import { getSharedMetadata } from "@/app/_helpers/helpers";
import React from "react";

export async function generateMetadata({ params, searchParams }: any) {
  const { locale } = await params;
  const { articleId } = await searchParams;

  const article = await FetchData(`/articles/${articleId}`, false);
  const title =
    locale == "en" ? "Aram Gulf - Blog" : "آرام الخليج المحدودة - المدونة";
  const sharedMetadata = await getSharedMetadata(title, title);

  return {
    title: `${title} - ${locale == "en" ? article.title_en : article.title_ar}`,
    description: `${title} - ${
      locale == "en" ? article.title_en : article.title_ar
    }`,
    ...sharedMetadata,
  };
}

export default async function ArticlePage({ searchParams }: any) {
  const { articleId } = await searchParams;
  const article = await FetchData(`/articles/${articleId}`, false);
  const randomArticles = await FetchData(`/random-articles`, false);
  const commentsResponse = await FetchData(
    `/article-comments?article_id=${articleId}`,
    true
  );

  return (
    <>
      <ArticlePageComponent
        article={article}
        randomArticles={randomArticles}
        commentsResponse={commentsResponse}
      />
    </>
  );
}
