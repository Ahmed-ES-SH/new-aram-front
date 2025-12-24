"use client";
import DynamicForm from "@/app/_components/_dashboard/_dynamicComponents/DynamicForm";
import { useAppSelector } from "@/app/Store/hooks";
import React from "react";

export default function AddCoupon() {
  const { categories } = useAppSelector((state) => state.categories);
  const addcouponeInputs = [
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
      name: "type",
      type: "",
      fildType: "select-type",
      label: { ar: "الفئة المستهدفة من الكوبون", en: "" },
      selectItems: [
        { name: "مستخدمين", value: "user" },
        { name: "مراكز", value: "organization" },
        { name: "عام", value: "general" },
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
      label: { ar: "عنوان الكوبون", en: "" },
      placeholder: "أدخل عنوان الكوبون",
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
      placeholder: "أدخل عدد مرات الاستخدام الخاصة بالكوبون",
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
        ar: "حدد تاريخ الانطلاق الخاص بالخدمه بحيث ستكون فعالة",
        en: "",
      },
      placeholder: "حدد تاريخ الانطلاق الخاص بالخدمه بحيث ستكون فعالة",
    },
    {
      name: "end_date",
      type: "date",
      fildType: "date-input",
      label: {
        ar: "حدد تاريخ الإنتهاء الخاص بالخدمه بحيث ستكون غير فعالة",
        en: "",
      },
      placeholder: "حدد تاريخ الإنتهاء الخاص بالخدمه بحيث ستكون غير فعالة",
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
      <DynamicForm
        title="إنشاء كوبون جديدة"
        submitValue="إنشاء"
        inputs={addcouponeInputs}
        api="/dashboard/add-coupon"
        direct="/dashboard/coupons"
        successMessage="تم إنشاء كوبون جديد بنجاح "
      />
    </>
  );
}
