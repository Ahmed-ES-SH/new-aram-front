"use client";
import DynamicElementPage from "@/app/_components/_dashboard/_dynamicComponents/DynamicElementPage";
import { useAppSelector } from "@/app/Store/hooks";
import React from "react";

export default function OfferPage({
  params,
}: {
  params: Promise<{ offerId: string }>;
}) {
  const { categories } = useAppSelector((state) => state.categories);
  const { offerId } = React.use(params);

  const offersInputs = [
    {
      name: "image",
      type: "file",
      fildType: "normal-image",
      label: { ar: "صورة العرض", en: "" },
    },
    {
      name: "organization",
      type: "",
      fildType: "org-show",
      label: { ar: "المركز الناشر للعرض", en: "" },
    },
    {
      name: "status",
      type: "",
      fildType: "select-type",
      label: { ar: "حالة العرض", en: "" },
      selectItems: [
        { name: "عام", value: "active" },
        { name: "محظور", value: "inactive" },
        { name: "منتهى", value: "expired" },
      ],
    },
    {
      name: "code",
      type: "text",
      fildType: "coupon-code",
      label: { ar: "الكود الخاص بالعرض", en: "" },
      placeholder: "أدخل الكود الخاص بالعرض",
    },
    {
      name: "title",
      type: "text",
      fildType: "short-text",
      label: { ar: "عنوان العرض", en: "" },
      placeholder: "أدخل عنوان العرض",
    },
    {
      name: "description",
      type: "text",
      fildType: "long-text",
      label: { ar: "وصف العرض", en: "" },
      placeholder: "أدخل وصف العرض",
    },
    {
      name: "category_id",
      type: "",
      fildType: "select-type",
      label: { ar: "القسم الرئيسى للعرض", en: "" },
      placeholder: "",
      selectItems: categories,
    },
    {
      name: "discount_type",
      type: "",
      fildType: "select-type",
      label: { ar: "فائدة العرض", en: "" },
      selectItems: [
        { name: "خصم نسبة محددة", value: "percentage" },
        { name: "خصم رقم محدد", value: "fixed" },
      ],
    },

    {
      name: "usage_limit",
      type: "number",
      fildType: "number-input",
      label: {
        ar: "عدد مرات الاستخدام الخاصة بالعرض",
        en: "",
      },
      placeholder: "أدخل نسبة الخصم الخاصة بالعرض",
    },
    {
      name: "discount_value",
      type: "number",
      fildType: "number-input",
      label: {
        ar: "قيمة الخصم على حسب نوع الفائدة التى سبق تحديدها سواء كان رقم او نسبة",
        en: "",
      },
      placeholder:
        "أدخل قيمة الخصم على حسب نوع الفائدة التى سبق تحديدها سواء كان رقم او نسبة",
    },
    {
      name: "start_date",
      type: "date",
      fildType: "date-input",
      label: {
        ar: "حدد تاريخ الانطلاق الخاص بالعرض بحيث سيكون فعال",
        en: "",
      },
      placeholder: "حدد تاريخ الانطلاق الخاص بالعرض بحيث سيكون فعال",
    },
    {
      name: "end_date",
      type: "date",
      fildType: "date-input",
      label: {
        ar: "حدد تاريخ الإنتهاء الخاص بالعرض بحيث سيكون غير فعال",
        en: "",
      },
      placeholder: "حدد تاريخ الإنتهاء الخاص بالعرض بحيث سيكون غير فعال",
    },
  ];

  return (
    <DynamicElementPage
      api={"/get-offer"}
      updateEndPoint={"/dashboard/update-offer"}
      id={offerId}
      inputsData={offersInputs}
      direct={"/ar/dashboard/offers"}
    />
  );
}
