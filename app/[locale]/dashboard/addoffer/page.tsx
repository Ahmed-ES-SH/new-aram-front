"use client";
import DynamicForm from "@/app/_components/_dashboard/_dynamicComponents/DynamicForm";
import { useAppSelector } from "@/app/Store/hooks";
import React from "react";

export default function AddOffer() {
  const { categories } = useAppSelector((state) => state.categories);

  const addOfferInputs = [
    {
      name: "image",
      type: "file",
      fildType: "normal-image",
      label: { ar: "صورة العرض", en: "" },
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
      placeholder: "أدخل نسبة الخصم الخاصة بالعرض",
    },
    {
      name: "organization_id",
      type: "",
      fildType: "select-org",
      label: {
        ar: "حدد المركز الذى تريد ربط العرض معه (لا يمكن انشاء عرض بدون مركز مقدم للعرض)",
        en: "",
      },
      placeholder: "",
      validation: {
        required: true,
        message: {
          ar: "يرجى اختيار المركز",
          en: "Please select an organization",
        },
      },
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
    <>
      <DynamicForm
        title="إنشاء عرض جديدة"
        submitValue="إنشاء"
        inputs={addOfferInputs}
        api="/add-offer"
        direct="/dashboard/offers"
        successMessage="تم إنشاء عرض جديد بنجاح "
      />
    </>
  );
}
