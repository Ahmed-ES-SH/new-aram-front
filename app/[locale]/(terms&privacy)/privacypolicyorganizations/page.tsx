import React from "react";
import FetchData from "@/app/_helpers/FetchData";
import { getTranslations } from "next-intl/server";
import { getSharedMetadata } from "@/app/_helpers/helpers";
import PrivacyPolicyOrganizations from "@/app/_components/_website/_auth/_terms&privacy/_organizations/PrivacyPolicyOrganizations";

export async function generateMetadata() {
  const t = await getTranslations("metaPrivacyPolicyOrganizations");
  const sharedMetadata = await getSharedMetadata(t("title"), t("description"));
  return {
    title: t("title"),
    describtion: t("description"),
    ...sharedMetadata,
  };
}

export default async function PrivacyPolicyPage() {
  const policies = await FetchData(`/organizations-points`, false);

  return <PrivacyPolicyOrganizations policies={policies} />;
}
