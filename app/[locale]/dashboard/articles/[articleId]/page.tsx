"use client";
import DynamicElementPage from "@/app/_components/_dashboard/_dynamicComponents/DynamicElementPage";
import { fetchCategories } from "@/app/Store/dataSlice";
import { AppDispatch, RootState } from "@/app/Store/store";
import { useParams } from "next/navigation";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function ArticlePage() {
  const params = useParams();
  const articleId = params.articleId as string;
  const dispatch = useDispatch<AppDispatch>();
  const { categories, loading, error } = useSelector(
    (state: RootState) => state.data
  );

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const inputsArticleData = [
    {
      name: "image",
      type: "file",
      fildType: "full-image",
      label: { ar: "صورة المقال", en: "" },
    },
    {
      name: "title_en",
      type: "text",
      fildType: "short-text",
      label: { ar: "(en) عنوان المقال", en: "" },
    },
    {
      name: "title_ar",
      type: "text",
      fildType: "short-text",
      label: { ar: "(ar) عنوان المقال", en: "" },
    },
    {
      name: "content_en",
      type: "text",
      fildType: "long-text",
      label: { ar: "(en) محتوى المقال", en: "" },
    },
    {
      name: "content_ar",
      type: "text",
      fildType: "long-text",
      label: { ar: "(ar) محتوى المقال", en: "" },
    },
    {
      name: "category_id",
      type: "",
      fildType: "select-type",
      label: { ar: "القسم الخاص بالمقال ", en: "" },
      selectItems: categories,
    },
    {
      name: "status",
      type: "",
      fildType: "select-type",
      label: { ar: "حالة المقال ", en: "" },
      selectItems: [
        { name: "draft" },
        { name: "published" },
        { name: "archived" },
      ],
    },
  ];

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <>
      <DynamicElementPage
        id={articleId}
        api="/article"
        updateEndPoint="/update-article"
        inputsData={inputsArticleData as any}
        direct=""
      />
    </>
  );
}
