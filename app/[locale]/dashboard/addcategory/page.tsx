import DynamicForm from "@/app/_components/_dashboard/_dynamicComponents/DynamicForm";
import { addCategoryinputs } from "@/app/constants/_dashboard/InputsArrays";
import React from "react";

export default function page() {
  return (
    <DynamicForm
      title="إنشاء قسم جديد"
      subtitle="املأ البيانات المطلوبة بدقة"
      submitValue="إنشاء"
      inputs={addCategoryinputs}
      api="/add-category"
      direct="/en/dashboard/categories"
      successMessage="تم إنشاء قسم جديد بنجاح "
    />
  );
}
