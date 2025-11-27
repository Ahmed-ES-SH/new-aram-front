import DynamicElementPage from "@/app/_components/_dashboard/_dynamicComponents/DynamicElementPage";
import NotFoundItem from "@/app/_components/_dashboard/NotFoundItem";
import LocaleLink from "@/app/_components/_website/_global/LocaleLink";
import FetchData from "@/app/_helpers/FetchData";
import { addCategoryinputs } from "@/app/constants/_dashboard/InputsArrays";
import React from "react";

export default async function CardCategoryPage({ params }: any) {
  const { cardcategoryId } = await params;
  const cardcategory = await FetchData(`/category/${cardcategoryId}`, false);
  const cardsLength = cardcategory?.sub_categories?.length || 0;

  if (!cardcategoryId) return <NotFoundItem />;

  return (
    <>
      <div className="flex items-center gap-4 max-md:flex-col w-fit mx-auto max-md:w-full">
        <LocaleLink
          href={`/dashboard/cards?category_id=${cardcategoryId}`}
          className="flex items-center justify-between gap-2 mt-3 w-fit mx-auto rounded-md p-3 bg-primary text-white hover:bg-white hover:text-black duration-200 cursor-pointer hover:border-primary border border-transparent"
        >
          عدد البطاقات <span className="font-bold">({cardsLength})</span>
        </LocaleLink>
      </div>
      <DynamicElementPage
        api={"/card-category"}
        updateEndPoint={"/update-card-category"}
        id={cardcategoryId}
        inputsData={addCategoryinputs}
        direct={"/en/dashboard/cardcategories"}
      />
    </>
  );
}
