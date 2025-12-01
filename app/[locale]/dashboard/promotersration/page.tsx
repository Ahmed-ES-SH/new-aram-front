import PointsEditForm from "@/app/_components/_dashboard/_promotersration/PointsEditForm";
import FetchData from "@/app/_helpers/FetchData";
import React from "react";

export default async function PromotersrationPage() {
  const data = await FetchData("/get-ratios", false);

  return <PointsEditForm initialData={data} />;
}
