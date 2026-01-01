import FetchOrganizations from "@/app/_components/_dashboard/_organizations/fetchOrgamizations";
import MainCategoriesGrid from "@/app/_components/_website/_organizations/MainCategoriesGrid";
import OrganizationsComponent from "@/app/_components/_website/_organizations/OrganizationsComponent";
import RedirectClient from "@/app/_components/_website/_organizations/RedirectClient";
import SubCategoriesGrid from "@/app/_components/_website/_organizations/SubCategoriesGrid";
import FetchData from "@/app/_helpers/FetchData";
import { getSharedMetadata } from "@/app/_helpers/helpers";
import { getTranslations } from "next-intl/server";
import React from "react";

export async function generateMetadata() {
  const t = await getTranslations("metaOrganizationsPage");
  const sharedMetadata = await getSharedMetadata(t("title"), t("description"));
  return {
    title: t("title"),
    description: t("description"),
    ...sharedMetadata,
  };
}

export default async function OrganizationsPage({ searchParams }: any) {
  const { step } = await searchParams;

  if (step == 1) {
    const categoriesResponse = await FetchData(`/public-categories`, true);
    return <MainCategoriesGrid response={categoriesResponse} />;
  }

  if (step == 2) {
    const {
      main_categoryId,
      subCategoriesLength,
      organizationsCount,
      main_category,
    } = await searchParams;

    // Instead of direct redirect()
    if (Number(subCategoriesLength) == 0) {
      return (
        <RedirectClient
          targetUrl={`/organizations?categories=${main_categoryId}&main_category=${main_category}&main_categoryId=${main_categoryId}&subCategoriesLength=${subCategoriesLength}&organizationsCount=${organizationsCount}&step=3`}
        />
      );
    }

    const subcategoriesResponse = await FetchData(
      `/sub-categories-by-parent?parent_id=${main_categoryId}&is_active=1`,
      true
    );

    return <SubCategoriesGrid response={subcategoriesResponse} />;
  }

  if (step == 3) {
    const { categories: categoriesParams } = await searchParams;
    const categories = categoriesParams
      ? categoriesParams.split(",").map(Number)
      : undefined;

    const { sub_categories: subCategoriesParams } = await searchParams;
    const subCategories = subCategoriesParams
      ? subCategoriesParams.split(",").map(Number)
      : undefined;

    const { page, query, rating, time, open_at, close_at } = await searchParams;

    const api = "/public-organizations";

    const response = await FetchOrganizations({
      api,
      page,
      query,
      categories,
      rating,
      subCategories,
      time,
      open_at,
      close_at,
    });

    const data = response?.data;
    const pagination = response?.pagination;
    return (
      <OrganizationsComponent pagination={pagination} organizations={data} />
    );
  }
}
