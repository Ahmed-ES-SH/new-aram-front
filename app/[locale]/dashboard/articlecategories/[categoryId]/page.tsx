import DynamicElementPage from "@/app/_components/_dashboard/_dynamicComponents/DynamicElementPage";
import NotFoundItem from "@/app/_components/_dashboard/NotFoundItem";
import { Categoryinputs } from "@/app/constants/_dashboard/InputsArrays";
import React from "react";

export default function page({ params }: any) {
  const categoryId = params.categoryId;

  if (categoryId) <NotFoundItem />;

  return (
    <>
      <DynamicElementPage
        api={"/article-category"}
        updateEndPoint={"/update-article-category"}
        id={categoryId}
        inputsData={Categoryinputs}
        direct={""}
      />
    </>
  );
}
