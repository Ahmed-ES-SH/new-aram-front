import NoOffersFounded from "@/app/_components/_website/_controlpanals/_centerorg/_orgOffers/NoOffersFounded";
import OffersPageComponent from "@/app/_components/_website/_controlpanals/_centerorg/_orgOffers/OffersPageComponent";
import FetchData from "@/app/_helpers/FetchData";
import React from "react";

export default async function OrgOffers() {
  const center = await FetchData(`/current-user`, false);
  const response = await FetchData(`/account-offers?id=${center.id}`, true);

  if (!response || response.error) return <NoOffersFounded />;

  const { data, pagination } = response;

  console.log(response);

  return <OffersPageComponent data={data} pagination={pagination} />;
}
