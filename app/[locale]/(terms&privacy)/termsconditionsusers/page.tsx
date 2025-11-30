import React from "react";
import FetchData from "@/app/_helpers/FetchData";
import { getTranslations } from "next-intl/server";
import { getSharedMetadata } from "@/app/_helpers/helpers";
import TermsConditionsUsers from "@/app/_components/_website/_auth/_terms&privacy/_users/TermsUsers";

export async function generateMetadata() {
  const t = await getTranslations("metaTermsConditionsUsers");
  const sharedMetadata = await getSharedMetadata(t("title"), t("description"));
  return {
    title: t("title"),
    description: t("description"),
    ...sharedMetadata,
  };
}

export default async function TermsConditionsUsersPage() {
  const terms = await FetchData(`/users-terms`, false);

  return <TermsConditionsUsers terms={terms} />;
}
