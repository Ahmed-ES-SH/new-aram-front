import PromoterReportsPage from "@/app/_components/_dashboard/promoter-reports/promoter-reports-page";
import FetchData from "@/app/_helpers/FetchData";
import React from "react";

export default async function PromoterPage({ params }: any) {
  const { promoterId } = await params;

  const promoterData = await FetchData(
    `/get-promoter/${promoterId}?type=user&activities=1`,
    false
  );

  return <PromoterReportsPage promoterData={promoterData} />;
}
