import React from "react";
import FetchData from "@/app/_helpers/FetchData";
import PrivacyPolicyUsers from "@/app/_components/_website/_auth/_terms&privacy/_users/PrivacyUsers";
import { getTranslations } from "next-intl/server";
import { getSharedMetadata } from "@/app/_helpers/helpers";

export async function generateMetadata() {
  const t = await getTranslations("metaPrivacyPolicyUsers");
  const sharedMetadata = await getSharedMetadata(t("title"), t("description"));
  return {
    title: t("title"),
    describtion: t("description"),
    ...sharedMetadata,
  };
}

export default async function PrivacyPolicyPage() {
  const policies = await FetchData(`/users-points`, false);

  return <PrivacyPolicyUsers policies={policies} />;
}
