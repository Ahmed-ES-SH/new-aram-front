"use client";
import DynamicElementPage from "@/app/_components/_dashboard/_dynamicComponents/DynamicElementPage";
import { useAppSelector } from "@/app/Store/hooks";
import React from "react";

export default function Page({
  params,
}: {
  params: Promise<{ couponId: string }>;
}) {
  const { categories } = useAppSelector((state) => state.categories);
  const { couponId } = React.use(params);

  const couponeInputs = [
    {
      name: "image",
      type: "file",
      fildType: "normal-image",
      label: { ar: "صورة الكوبون", en: "" },
    },
    {
      name: "status",
      type: "",
      fildType: "select-type",
      label: { ar: "حالة الكوبون", en: "" },
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
      label: { ar: "الكود الخاص بالكوبون", en: "" },
      placeholder: "أدخل الكود الخاص بالكوبون",
    },
    {
      name: "title",
      type: "text",
      fildType: "short-text",
      label: { ar: "إسم الكوبون", en: "" },
      placeholder: "أدخل إسم الكوبون",
    },
    {
      name: "description",
      type: "text",
      fildType: "long-text",
      label: { ar: "وصف الكوبون", en: "" },
      placeholder: "أدخل وصف الكوبون",
    },
    {
      name: "category_id",
      type: "",
      fildType: "select-type",
      label: { ar: "القسم الرئيسى للكوبون", en: "" },
      placeholder: "",
      selectItems: categories,
    },
    {
      name: "sub_categories",
      type: "",
      fildType: "sub-category",
      label: { ar: "الاقسام الفرعية للكوبون", en: "" },
      placeholder: "",
    },
    {
      name: "benefit_type",
      type: "",
      fildType: "select-type",
      label: { ar: "فائدة الكوبون", en: "" },
      selectItems: [
        { name: "خصم نسبة محددة", value: "percentage" },
        { name: "خصم رقم محدد", value: "fixed" },
        { name: "بطاقة مجانية", value: "free_card" },
      ],
    },
    {
      name: "usage_limit",
      type: "number",
      fildType: "number-input",
      label: {
        ar: "عدد مرات الاستخدام الخاصة بالكوبون",
        en: "",
      },
      placeholder: "أدخل نسبة الخصم الخاصة بالكوبون",
    },
    {
      name: "discount_value",
      type: "number",
      fildType: "number-input",
      label: {
        ar: "نسبة الخصم الخاصة بالكوبون (ستظهر فى حالة تم اختيار نوع الفائدة خصم نسبة محددة)",
        en: "",
      },
      placeholder: "أدخل نسبة الخصم الخاصة بالكوبون",
    },
    {
      name: "start_date",
      type: "date",
      fildType: "date-input",
      label: {
        ar: "حدد تاريخ الانطلاق الخاص بالكوبون بحيث سيكون فعال",
        en: "",
      },
      placeholder: "حدد تاريخ الانطلاق الخاص بالكوبون بحيث سيكون فعالة",
    },
    {
      name: "end_date",
      type: "date",
      fildType: "date-input",
      label: {
        ar: "حدد تاريخ الإنتهاء الخاص بالكوبون بحيث سيكون غير فعال",
        en: "",
      },
      placeholder: "حدد تاريخ الإنتهاء الخاص بالكوبون بحيث سيكون غير فعال",
    },
    {
      name: "",
      type: "",
      fildType: "special-section",
      label: {
        ar: "",
        en: "",
      },
      placeholder: "",
    },
  ];
  return (
    <>
      <DynamicElementPage
        api={"/get-coupon"}
        updateEndPoint={"/dashboard/update-coupon"}
        id={couponId}
        inputsData={couponeInputs}
        direct={"/ar/dashboard/coupons"}
      />
    </>
  );
}
