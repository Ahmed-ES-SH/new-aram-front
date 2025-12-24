import DynamicForm from "@/app/_components/_dashboard/_dynamicComponents/DynamicForm";
import { addCategoryinputs } from "@/app/constants/_dashboard/InputsArrays";

export default function page() {
  return (
    <>
      <DynamicForm
        title="إنشاء قسم مقالى جديد"
        submitValue="إنشاء"
        inputs={addCategoryinputs}
        api="/add-article-category"
        direct="/ar/dashboard/articlecategories"
        successMessage="تم إنشاء قسم جديد ينجاح "
      />
    </>
  );
}
