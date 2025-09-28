import DynamicForm from "@/app/_components/_dashboard/_dynamicComponents/DynamicForm";
import { Categoryinputs } from "@/app/constants/_dashboard/InputsArrays";
import React from "react";

export default function page() {
  return (
    <>
      <h1 className="pb-3 text-lg border-b border-primary text-center mb-4">
        إضافة قسم مقالى جديد
      </h1>
      <DynamicForm
        title="إنشاء قسم مقالى جديد"
        submitValue="إنشاء"
        inputs={Categoryinputs}
        api="/add-article-category"
        direct="/dashboard/articlecategories"
        successMessage="تم إنشاء قسم جديد ينجاح "
      />
    </>
  );
}
