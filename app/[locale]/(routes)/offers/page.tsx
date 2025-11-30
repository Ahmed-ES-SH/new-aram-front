import { Offer } from "@/app/_components/_dashboard/_offers/types";
import FetchOffers from "@/app/_components/_website/_offers/fetchOffers";
import OffersGrid from "@/app/_components/_website/_offers/OffersGrid";
import OffersHeader from "@/app/_components/_website/_offers/OffersHeader";
import OrganizationsSlider from "@/app/_components/_website/_offers/OrganizationsSlider";
import StatsSection from "@/app/_components/_website/_offers/StatsSection";
import FetchData from "@/app/_helpers/FetchData";
import { getSharedMetadata } from "@/app/_helpers/helpers";
import { directionMap } from "@/app/constants/_website/global";
import { getTranslations } from "next-intl/server";
import React from "react";

interface responseType {
  data: Offer[];
  pagination: {
    current_page: number;
    last_page: number;
  };
}

export async function generateMetadata() {
  const t = await getTranslations("metaOffersPage");
  const sharedMetadata = await getSharedMetadata(t("title"), t("description"));
  return {
    title: t("title"),
    description: t("description"),
    ...sharedMetadata,
  };
}

export default async function OffersPage({ searchParams, params }: any) {
  const { locale } = await params;

  const { query, category, sort_by, page } = await searchParams;

  // Fetch data
  const response = await FetchOffers({ query, category, sort_by, page });

  const organizations = await FetchData(`/top-public-organizations`, false);

  if (!response) return null;

  const { data, pagination } = response as responseType;

  return (
    <div dir={directionMap[locale]} className="w-full">
      <OffersHeader />
      <div className="c-container  mb-6">
        <OffersGrid offers={data} pagination={pagination} />
        <OrganizationsSlider organizations={organizations} />
        <StatsSection />
      </div>
    </div>
  );
}
