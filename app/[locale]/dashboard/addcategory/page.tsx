import DynamicForm from "@/app/_components/_dashboard/_dynamicComponents/DynamicForm";
import { addCategoryinputs } from "@/app/constants/_dashboard/InputsArrays";

export default function page() {
  return (
    <DynamicForm
      title="إنشاء قسم جديد"
      subtitle="املأ البيانات المطلوبة بدقة"
      submitValue="إنشاء"
      inputs={addCategoryinputs}
      api="/add-category"
      direct="/ar/dashboard/categories"
      successMessage="تم إنشاء قسم جديد بنجاح "
    />
  );
}
