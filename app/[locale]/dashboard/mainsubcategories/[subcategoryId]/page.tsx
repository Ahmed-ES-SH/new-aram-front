import DynamicElementPage from "@/app/_components/_dashboard/_dynamicComponents/DynamicElementPage";
import { addCategoryinputs } from "@/app/constants/_dashboard/InputsArrays";
import React from "react";

export default async function page({ params }: any) {
  const { subcategoryId } = await params;
  return (
    <>
      <DynamicElementPage
        api={"/sub-category"}
        updateEndPoint={"/update-category"}
        id={subcategoryId}
        inputsData={addCategoryinputs}
        direct={`/en/dashboard/subcategories`}
      />
    </>
  );
}
