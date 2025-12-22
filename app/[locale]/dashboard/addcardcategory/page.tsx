import DynamicForm from "@/app/_components/_dashboard/_dynamicComponents/DynamicForm";
import { addCategoryinputs } from "@/app/constants/_dashboard/InputsArrays";
import React from "react";

export default function AddCardCategory() {
  return (
    <DynamicForm
      title="إنشاء قسم بطاقة جديد"
      subtitle="املأ البيانات المطلوبة بدقة"
      submitValue="إنشاء"
      inputs={addCategoryinputs}
      api="/add-card-category"
      direct="/en/dashboard/cardcategories"
      successMessage="تم إنشاء قسم جديد بنجاح "
    />
  );
}
