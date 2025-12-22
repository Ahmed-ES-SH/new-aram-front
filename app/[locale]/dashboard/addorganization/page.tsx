"use client";
import DynamicForm from "@/app/_components/_dashboard/_dynamicComponents/DynamicForm";
import { useAppSelector } from "@/app/Store/hooks";
import React from "react";

export default function AddOrganization() {
  const { categories } = useAppSelector((state) => state.categories);

  const addOrganizationInputs = [
    {
      name: "logo",
      type: "file",
      fildType: "logo-image",
      label: { ar: "شعار المركز", en: "" },
    },
    {
      name: "image",
      type: "file",
      fildType: "full-image",
      label: { ar: "صورة الغلاف", en: "" },
    },
    {
      name: "status",
      type: "",
      fildType: "select-type",
      label: { ar: "حالة المركز", en: "" },
      selectItems: [
        { name: "عام", value: "published" },
        { name: "ممنوع من الظهور", value: "not_published" },
        { name: "تحت المراجعة", value: "under_review" },
      ],
    },
    {
      name: "email",
      type: "text",
      fildType: "short-text",
      label: { ar: "البريد الإلكترونى للمركز", en: "" },
      placeholder: "أدخل البريد الإلكترونى الخاص  بالمركز",
      readOnly: true,
    },
    {
      name: "password",
      type: "password",
      fildType: "fild-password",
      label: { ar: "كلمة السر للمركز", en: "" },
      placeholder: "أدخل كلمة السر الخاصه  بالمركز",
    },
    {
      name: "phone_number",
      type: "tel",
      fildType: "phone-input",
      label: { ar: "رقم الهاتف", en: "" },
      placeholder: "أدخل رقم الهاتف الخاص  بالمركز",
    },
    {
      name: "title",
      type: "text",
      fildType: "short-text",
      label: { ar: "إسم المركز", en: "" },
      placeholder: "أدخل إسم المركز",
    },
    {
      name: "description",
      type: "text",
      fildType: "long-text",
      label: { ar: "وصف المركز", en: "" },
      placeholder: "أدخل وصف المركز",
    },
    {
      name: "location",
      type: "",
      readOnly: true,
      fildType: "location",
      label: { ar: "عنوان المركز", en: "" },
      placeholder: "أدخل عنوان المركز",
    },
    {
      name: "accaptable_message",
      type: "text",
      fildType: "long-text",
      label: { ar: "رسالة قبول الحجز", en: "" },
      placeholder: "أدخل رسالة قبول الحجز",
    },
    {
      name: "unaccaptable_message",
      type: "text",
      fildType: "long-text",
      label: { ar: "رسالة رفض طلب الحجز", en: "" },
      placeholder: "أدخل رسالة رفض طلب الحجز",
    },
    {
      name: "url",
      type: "text",
      fildType: "short-text",
      label: { ar: "الرابط الخاص بالمركز", en: "" },
      placeholder: "أدخل الرابط الخاص بالمركز",
    },
    {
      name: "open_at",
      type: "text",
      fildType: "time-input",
      label: { ar: "وقت بداية العمل للمركز", en: "" },
      placeholder: "أدخل وقت بداية العمل للمركز",
    },
    {
      name: "close_at",
      type: "text",
      fildType: "time-input",
      label: { ar: "وقت نهاية العمل للمركز", en: "" },
      placeholder: "أدخل وقت نهاية العمل للمركز",
    },
    {
      name: "confirmation_price",
      type: "number",
      fildType: "number-input",
      label: { ar: "سعر تأكيد الحجز المحدد من قبل المركز", en: "" },
      placeholder: "أدخل سعر تأكيد الحجز المحدد من قبل المركز",
    },

    {
      name: "active",
      type: "",
      fildType: "select-type",
      label: { ar: "حالة ظهور المركز فى الرئيسية", en: "" },
      placeholder: "",
      selectItems: [
        { name: "مسموح", value: 1 },
        { name: "ممنوع", value: 0 },
      ],
    },
    {
      name: "booking_status",
      type: "",
      fildType: "select-type",
      label: { ar: "هل الحجز متاح من قبل المركز", en: "" },
      placeholder: "",
      selectItems: [
        { name: "متاح الحجز", value: 1 },
        { name: "الحجز مغلق من المركز", value: 0 },
      ],
    },
    {
      name: "confirmation_status",
      type: "",
      fildType: "select-type",
      label: { ar: "هل يطلب المركز تأكيد للحجز", en: "" },
      placeholder: "",
      selectItems: [
        { name: "نعم , تأكيد الحجز مفعل من قبل المركز", value: 1 },
        { name: "لا , تأكيد الحجز غير مفعل من قبل المركز", value: 0 },
      ],
    },
    {
      name: "category_id",
      type: "",
      fildType: "select-type",
      label: { ar: "القسم الرئيسى للمركز", en: "" },
      placeholder: "",
      selectItems: categories,
    },
    {
      name: "sub_categories",
      type: "",
      fildType: "sub-category",
      label: { ar: "الاقسام الفرعية للمركز", en: "" },
      placeholder: "",
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
      name: "benefits", // المفتاح الأساسي
      type: "",
      fildType: "array", // النوع العام
      displayKey: "title", // المفتاح المستخدم للعرض
      label: { ar: "المميزات", en: "" },
      placeholder: "أدخل ميزة جديدة",
    },
  ];

  return (
    <>
      <DynamicForm
        title="إنشاء مركز جديد"
        submitValue="إنشاء"
        inputs={addOrganizationInputs}
        api="/add-organization"
        direct="/dashboard/organizations"
        successMessage="تم إنشاء مركز جديد بنجاح "
      />
    </>
  );
}
