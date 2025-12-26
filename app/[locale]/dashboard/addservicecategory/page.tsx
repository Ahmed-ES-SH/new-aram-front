import DynamicForm from "@/app/_components/_dashboard/_dynamicComponents/DynamicForm";
import { addCategoryinputs } from "@/app/constants/_dashboard/InputsArrays";
import React from "react";

export default function AddServiceCategory() {
  return (
    <DynamicForm
      title="إنشاء قسم خدمة جديد"
      subtitle="املأ البيانات المطلوبة بدقة"
      submitValue="إنشاء"
      inputs={addCategoryinputs}
      api="/add-service-category"
      direct="/ar/dashboard/servicecategories"
      successMessage="تم إنشاء قسم جديد بنجاح "
    />
  );
}
