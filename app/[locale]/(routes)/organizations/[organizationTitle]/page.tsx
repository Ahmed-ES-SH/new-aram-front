import CardsSlider from "@/app/_components/_website/_global/CardsSlider";
import OrganizationPageComponent from "@/app/_components/_website/_organizations/organizationPage/OrganizationPageComponent";
import FetchData from "@/app/_helpers/FetchData";
import { getSharedMetadata } from "@/app/_helpers/helpers";
import React from "react";

export async function generateMetadata({ params, searchParams }: any) {
  const { locale } = await params;
  const { orgId } = await searchParams;

  const oranization = await FetchData(`/organizations/${orgId}`, false);
  const title =
    locale == "en"
      ? "Aram Gulf - Partner Centers"
      : "آرام الخليج المحدودة - المراكز الشريكة";
  const sharedMetadata = await getSharedMetadata(title, title);

  return {
    title: `${title} - ${oranization.title}`,
    description: `${title} - ${oranization.title}`,
    ...sharedMetadata,
  };
}

export default async function OrganizationPage({ searchParams }: any) {
  const { orgId } = await searchParams;
  const organization = await FetchData(`/organizations/${orgId}`, false);

  const offers = await FetchData(`/active-offers/${orgId}?limit=8`, false);

  const cards = await FetchData(`/eight-public-cards`, false);

  return (
    <>
      <OrganizationPageComponent offers={offers} organization={organization} />
      <CardsSlider cards={cards} />
    </>
  );
}
