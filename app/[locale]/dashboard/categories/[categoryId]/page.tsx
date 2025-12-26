import React from "react";
import DynamicElementPage from "@/app/_components/_dashboard/_dynamicComponents/DynamicElementPage";
import NotFoundItem from "@/app/_components/_dashboard/NotFoundItem";
import { addCategoryinputs } from "@/app/constants/_dashboard/InputsArrays";
import FetchData from "@/app/_helpers/FetchData";
import { CiCirclePlus } from "react-icons/ci";
import LocaleLink from "@/app/_components/_website/_global/LocaleLink";

export default async function CategoryPage({ params }: any) {
  const { categoryId } = await params;
  const category = await FetchData(`/category/${categoryId}`, false);
  const subCategoriesLength = category?.sub_categories?.length || 0;

  if (!categoryId) return <NotFoundItem />;

  return (
    <>
      <div className="flex items-center gap-4 max-md:flex-col w-fit mx-auto max-md:w-full">
        <LocaleLink
          href={`/dashboard/mainsubcategories?parentId=${categoryId}`}
          className="flex items-center justify-between gap-2 mt-3 w-fit mx-auto rounded-md p-3 bg-primary text-white hover:bg-white hover:text-black duration-200 cursor-pointer hover:border-primary border border-transparent"
        >
          عدد الأقسام الفرعية{" "}
          <span className="font-bold">({subCategoriesLength})</span>
        </LocaleLink>
        <LocaleLink
          href={`/dashboard/addsubcategory?parentId=${categoryId}`}
          className="flex items-center justify-between gap-2 mt-3 w-fit mx-auto rounded-md p-3 bg-sky-300 text-white hover:bg-white hover:text-black duration-200 cursor-pointer hover:border-sky-300 border border-transparent"
        >
          أضف قسم فرعى
          <CiCirclePlus className="size-6" />
        </LocaleLink>
      </div>
      <DynamicElementPage
        api={"/category"}
        updateEndPoint={"/update-category"}
        id={categoryId}
        inputsData={addCategoryinputs}
        direct={"/ar/dashboard/categories"}
      />
    </>
  );
}
