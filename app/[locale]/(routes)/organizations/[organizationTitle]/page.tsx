import CardsSlider from "@/app/_components/_website/_global/CardsSlider";
import OrganizationPageComponent from "@/app/_components/_website/_organizations/organizationPage/OrganizationPageComponent";
import FetchData from "@/app/_helpers/FetchData";
import { getSharedMetadata } from "@/app/_helpers/helpers";
import React from "react";

export async function generateMetadata({ params, searchParams }: any) {
  const locale = params.locale;
  const oranizationId = searchParams.orgId;

  const oranization = await FetchData(`/organizations/${oranizationId}`, false);
  const title =
    locale == "en"
      ? "Aram Gulf - Partner Centers"
      : "آرام الخليج المحدودة - المراكز الشريكة";
  const sharedMetadata = await getSharedMetadata(title, title);

  return {
    title: `${title} - ${oranization.title}`,
    describtion: `${title} - ${oranization.title}`,
    ...sharedMetadata,
  };
}

export default async function OrganizationPage({ searchParams }: any) {
  const organizationId = searchParams.orgId;
  const organization = await FetchData(
    `/organizations/${organizationId}`,
    false
  );

  const offers = await FetchData(
    `/active-offers/${organizationId}?limit=8`,
    false
  );

  const cards = await FetchData(`/eight-public-cards`, false);

  return (
    <>
      <OrganizationPageComponent offers={offers} organization={organization} />
      <CardsSlider cards={cards} />
    </>
  );
}
