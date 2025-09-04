import FetchOrganizations from "@/app/_components/_dashboard/_organizations/fetchOrgamizations";
import OrganizationsComponent from "@/app/_components/_website/_organizations/OrganizationsComponent";
import React from "react";

export default async function OrganizationsPage({ searchParams }: any) {
  const category_id = searchParams.categories
    ? searchParams.categories.split(",").map(Number)
    : undefined;

  const subCategories = searchParams.sub_categories
    ? searchParams.sub_categories.split(",").map(Number)
    : undefined;

  const { page, query, rating } = await searchParams;
  const api = "/public-organizations";

  const { data, pagination } = await FetchOrganizations({
    api,
    page,
    query,
    category_id,
    rating,
    subCategories,
  });

  return (
    <>
      <OrganizationsComponent pagination={pagination} organizations={data} />
    </>
  );
}
