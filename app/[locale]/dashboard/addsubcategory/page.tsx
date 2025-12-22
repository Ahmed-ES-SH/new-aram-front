import DynamicForm from "@/app/_components/_dashboard/_dynamicComponents/DynamicForm";
import FetchData from "@/app/_helpers/FetchData";
import React from "react";

export default async function page() {
  const categories = await FetchData(`/all-public-categories`, false);

  const addCategoryinputs = [
    {
      name: "image",
      type: "file",
      fildType: "normal-image",
      label: { ar: "صورة القسم", en: "" },
    },
    {
      name: "icon_name",
      type: "non-input",
      fildType: "icon-fild",
      label: { ar: "حدد  أيقونة القسم", en: "" },
    },
    {
      name: "title_en",
      type: "text",
      fildType: "short-text",
      label: { ar: "العنوان (EN)", en: "" },
      placeholder: "أدخل عنوان القسم الجديد بالانجلزية",
    },
    {
      name: "title_ar",
      type: "text",
      fildType: "short-text",
      label: { ar: "العنوان (AR)", en: "" },
      placeholder: "أدخل عنوان القسم الجديد بالعربية",
    },

    {
      name: "gender",
      type: "",
      fildType: "select-type",
      label: { ar: "القسم الرئيسى", en: "" },
      placeholder: "",
      selectItems: categories,
    },

    {
      name: "bg_color",
      type: "color",
      fildType: "color-fild",
      label: { ar: "حدد لون خلفية القسم", en: "" },
      placeholder: "",
    },
  ];

  return (
    <DynamicForm
      title="إنشاء قسم فرعى جديد"
      subtitle="املأ البيانات المطلوبة بدقة"
      submitValue="إنشاء"
      inputs={addCategoryinputs}
      api="/add-category"
      direct="/en/dashboard/categories"
      successMessage="تم إنشاء قسم جديد بنجاح "
    />
  );
}
