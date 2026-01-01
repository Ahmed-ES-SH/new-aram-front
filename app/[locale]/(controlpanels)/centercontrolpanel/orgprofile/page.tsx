import OrganizationProfile from "@/app/_components/_website/_controlpanals/_centerorg/_orgProfile/OrganizationProfile";
import FetchData from "@/app/_helpers/FetchData";
import React from "react";

export default async function OrgProfilePage() {
  const center = await FetchData(`/current-user`, false);
  const categories = await FetchData(`/categories-with-subcategories`, false);

  return (
    <div className="w-full hidden-scrollbar">
      <OrganizationProfile organization={center} categories={categories} />
    </div>
  );
}
