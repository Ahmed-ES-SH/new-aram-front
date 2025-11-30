import React from "react";
import FetchData from "@/app/_helpers/FetchData";
import { getTranslations } from "next-intl/server";
import { getSharedMetadata } from "@/app/_helpers/helpers";
import TermsConditionsOrganizations from "@/app/_components/_website/_auth/_terms&privacy/_organizations/TermsConditionsOrganizations";

export async function generateMetadata() {
  const t = await getTranslations("metaTermsConditionsUsers");
  const sharedMetadata = await getSharedMetadata(t("title"), t("description"));
  return {
    title: t("title"),
    description: t("description"),
    ...sharedMetadata,
  };
}

export default async function TermsConditionsOrganizationsPage() {
  const terms = await FetchData(`/organiztions-terms`, false);

  return <TermsConditionsOrganizations terms={terms} />;
}
