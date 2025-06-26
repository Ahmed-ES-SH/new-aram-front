"use client";
import DynamicForm from "@/app/_components/_dashboard/_dynamicComponents/DynamicForm";
import React from "react";

export default function Page() {
  const inputsArticleData = [
    {
      name: "image",
      type: "file",
      fildType: "full-image",
      label: { ar: "صورة المقال", en: "" },
    },
    {
      name: "author_id",
      type: "",
      fildType: "non",
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
      selectItems: [],
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
  return (
    <>
      <DynamicForm
        inputs={inputsArticleData}
        api={"/add-article"}
        direct={"/dashboard/articles"}
        submitValue={"إنشاء"}
        successMessage={"تم إضافة المقال الى قائمة المقالات بنجاح "}
      />
    </>
  );
}
