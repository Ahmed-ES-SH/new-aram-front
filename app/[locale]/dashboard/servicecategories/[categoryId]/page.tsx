import DynamicElementPage from "@/app/_components/_dashboard/_dynamicComponents/DynamicElementPage";
import NotFoundItem from "@/app/_components/_dashboard/NotFoundItem";
import { addCategoryinputs } from "@/app/constants/_dashboard/InputsArrays";

export default async function CategoryPage({ params }: any) {
  const { categoryId } = await params;

  if (!categoryId) return <NotFoundItem />;

  return (
    <>
      <DynamicElementPage
        api={"/service-category"}
        updateEndPoint={"/update-service-category"}
        id={categoryId}
        inputsData={addCategoryinputs}
        direct={"/ar/dashboard/servicecategories"}
      />
    </>
  );
}
