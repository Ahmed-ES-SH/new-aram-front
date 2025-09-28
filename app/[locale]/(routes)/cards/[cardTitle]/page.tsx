import CardPageComponent from "@/app/_components/_website/_cards/cardPage/CardPageComponent";
import OrganizationsSlider from "@/app/_components/_website/_offers/OrganizationsSlider";
import FetchData from "@/app/_helpers/FetchData";
import { getSharedMetadata } from "@/app/_helpers/helpers";
import React from "react";

export async function generateMetadata({ params, searchParams }: any) {
  const locale = params.locale;
  const cardId = searchParams.cardId;

  const card = await FetchData(`/get-card/${cardId}`, false);
  const title =
    locale == "en" ? "Aram Gulf - cards" : "آرام الخليج المحدودة - البطاقات";
  const sharedMetadata = await getSharedMetadata(title, title);

  return {
    title: `${title} - ${card.title}`,
    describtion: `${title} - ${card.title}`,
    ...sharedMetadata,
  };
}

export default async function CardPage({ searchParams }: any) {
  const cardId = searchParams.cardId;

  const card = await FetchData(`/get-card/${cardId}`, false);
  const organizations = await FetchData(`/top-public-organizations`, false);
  return (
    <>
      <CardPageComponent card={card} />
      <div className="c-container">
        <OrganizationsSlider organizations={organizations} />
      </div>
    </>
  );
}
