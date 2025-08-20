"use client";
import DynamicForm from "@/app/_components/_dashboard/_dynamicComponents/DynamicForm";
import LoadingPage from "@/app/_components/_website/_global/LoadingPage";
import { useAppSelector } from "@/app/Store/hooks";
import React from "react";

export default function AddCardPage() {
  const { categories, loading } = useAppSelector(
    (state) => state.cardCategories
  );

  const addCardInputs = [
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
      label: { ar: "مدة سريان البطاقة", en: "" },
      placeholder: "أدخل مدة سريان البطاقة",
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
      name: "active",
      type: "",
      fildType: "select-type",
      label: { ar: "حالة ظهور البطاقة", en: "" },
      placeholder: "",
      selectItems: [
        { name: "عامة", value: 1 },
        { name: "مخفية", value: 0 },
      ],
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
    <DynamicForm
      title="إنشاء بطاقة جديدة"
      submitValue="إنشاء"
      inputs={addCardInputs}
      api="/dashboard/add-card"
      direct="/dashboard/cards"
      successMessage="تم إنشاء بطاقة جديدة بنجاح "
    />
  );
}
