"use client";
import DynamicElementPage from "@/app/_components/_dashboard/_dynamicComponents/DynamicElementPage";
import { useAppSelector } from "@/app/Store/hooks";
import React from "react";

export default function ServicePage({ params }: any) {
  const { categories } = useAppSelector((state) => state.categories);
  const serviceId = params.serviceId;

  const serviceInputs = [
    {
      name: "image",
      type: "file",
      fildType: "normal-image",
      label: { ar: "صورة الخدمة", en: "" },
    },

    {
      name: "status",
      type: "",
      fildType: "select-type",
      label: { ar: "حالة الخدمة", en: "" },
      selectItems: [
        { name: "عام", value: "approved" },
        { name: "محظور", value: "rejected" },
        { name: "تحت المراجعة", value: "pending" },
        { name: "معلق", value: "suspended" },
      ],
    },
    {
      name: "title",
      type: "text",
      fildType: "short-text",
      label: { ar: "إسم الخدمة", en: "" },
      placeholder: "أدخل إسم الخدمة",
    },
    {
      name: "description",
      type: "text",
      fildType: "long-text",
      label: { ar: "وصف الخدمة", en: "" },
      placeholder: "أدخل وصف الخدمة",
    },
    {
      name: "images",
      type: "",
      fildType: "images-section",
      label: { ar: "وصف الخدمة", en: "" },
      placeholder: "أدخل وصف الخدمة",
    },
    {
      name: "category_id",
      type: "",
      fildType: "select-type",
      label: { ar: "القسم الرئيسى للخدمة", en: "" },
      placeholder: "",
      selectItems: categories,
    },
    {
      name: "benefit_type",
      type: "",
      fildType: "select-type",
      label: { ar: "فائدة الخدمة", en: "" },
      selectItems: [
        { name: "خصم نسبة محددة", value: "percentage" },
        { name: "خصم رقم محدد", value: "price" },
        { name: "مميزات خاصة", value: "benefits" },
      ],
    },
    {
      name: "discount_percentage",
      type: "number",
      fildType: "number-input",
      label: {
        ar: "نسبة الخصم الخاصة بالخدمة (ستظهر فى حالة تم اختيار نوع الفائدة خصم نسبة محددة)",
        en: "",
      },
      placeholder: "أدخل نسبة الخصم الخاصة بالخدمة",
    },
    {
      name: "discount_price",
      type: "number",
      fildType: "number-input",
      label: {
        ar: "قيمة الخصم الخاص بالخدمة (ستظهر فى حالة تم اختيار نوع الفائدة خصم رقم محددة)",
        en: "",
      },
      placeholder: "أدخل قيمة الخصم الخاص بالخدمة",
    },
    {
      name: "exclusive_start_date",
      type: "date",
      fildType: "date-input",
      label: {
        ar: "حدد تاريخ الانطلاق الخاص بالخدمه بحيث ستكون فعالة",
        en: "",
      },
      placeholder: "حدد تاريخ الانطلاق الخاص بالخدمه بحيث ستكون فعالة",
    },
    {
      name: "exclusive_end_date",
      type: "date",
      fildType: "date-input",
      label: {
        ar: "حدد تاريخ الإنتهاء الخاص بالخدمه بحيث ستكون غير فعالة",
        en: "",
      },
      placeholder: "حدد تاريخ الإنتهاء الخاص بالخدمه بحيث ستكون غير فعالة",
    },
    {
      name: "", // المفتاح الأساسي
      type: "",
      fildType: "keywords", // النوع العام
      displayKey: "title", // المفتاح المستخدم للعرض
      label: { ar: "الكلمات المفتاحية", en: "" },
      placeholder: "",
    },
    {
      name: "", // المفتاح الأساسي
      type: "",
      fildType: "select-organizations", // النوع العام
      label: {
        ar: "حدد المراكز الداعمة للخدمة (يمكنك عدم تحديد اى مراكز ايضا)",
        en: "",
      },
      placeholder: "",
    },
    {
      name: "benefits", // المفتاح الأساسي
      type: "",
      fildType: "array", // النوع العام
      displayKey: "title", // المفتاح المستخدم للعرض
      label: {
        ar: "المميزات الخاصة بالخدمه (بحيث ستظهر فى حالة تم إختيار نوع الفائده مميزات خاصة)",
        en: "",
      },
      placeholder: "أدخل ميزة جديدة",
    },
  ];

  return (
    <>
      <DynamicElementPage
        api={"/get-service"}
        updateEndPoint={"/dashboard/update-service"}
        id={serviceId}
        inputsData={serviceInputs}
        direct={"/ar/dashboard/services"}
      />
    </>
  );
}
