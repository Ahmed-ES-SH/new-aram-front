"use client";
import DynamicElementPage from "@/app/_components/_dashboard/_dynamicComponents/DynamicElementPage";
import LoadingPage from "@/app/_components/_website/_global/LoadingPage";
import { useAppSelector } from "@/app/Store/hooks";
import { useParams } from "next/navigation";
import React from "react";

export default function CardPage() {
  const params = useParams();
  const cardId = params.cardId;
  const { categories, loading } = useAppSelector(
    (state) => state.cardCategories
  );

  const Cradinputs = [
    {
      name: "image",
      type: "file",
      fildType: "normal-image",
      label: { ar: "صورة البطاقة", en: "" },
    },
    {
      name: "title",
      type: "text",
      fildType: "short-text",
      label: { ar: "عنوان البطاقة", en: "" },
      placeholder: "أدخل عنوان البطاقة",
    },
    {
      name: "description",
      type: "text",
      fildType: "long-text",
      label: { ar: "وصف البطاقة", en: "" },
      placeholder: "أدخل وصف البطاقة",
    },
    {
      name: "price",
      type: "number",
      fildType: "number-input",
      label: { ar: "سعر البطاقة", en: "" },
      placeholder: "أدخل سعر البطاقة",
    },
    {
      name: "price_before_discount",
      type: "number",
      fildType: "number-input",
      label: { ar: "سعر البطاقة قبل الخصم", en: "" },
      placeholder: "أدخل سعر البطاقة قبل الخصم",
    },
    {
      name: "duration",
      type: "number",
      fildType: "number-input",
      label: { ar: "مدة سريان البطاقة ( بالشهور )", en: "" },
      placeholder: "أدخل مدة سريان البطاقة ( بالشهور )",
    },
    {
      name: "category_id",
      type: "",
      fildType: "select-type",
      label: { ar: "قسم البطاقة", en: "" },
      placeholder: "",
      selectItems: categories,
    },
    {
      name: "benefits", // المفتاح الأساسي
      type: "",
      fildType: "array", // النوع العام
      displayKey: "title", // المفتاح المستخدم للعرض
      label: { ar: "المميزات", en: "" },
      placeholder: "أدخل ميزة جديدة",
    },
    {
      name: "", // المفتاح الأساسي
      type: "",
      fildType: "keywords", // النوع العام
      displayKey: "title", // المفتاح المستخدم للعرض
      label: { ar: "الكلمات المفتاحية", en: "" },
      placeholder: "",
    },
  ];

  if (loading) return <LoadingPage />;

  return (
    <>
      <DynamicElementPage
        api={"/get-card"}
        updateEndPoint={"/dashboard/update-card"}
        id={cardId as any}
        inputsData={Cradinputs}
        direct={"/ar/dashboard/cards"}
      />
    </>
  );
}
