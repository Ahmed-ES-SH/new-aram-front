import AccountSelection from "@/app/_components/_website/_auth/_signup/AccountSelection";
import FetchData from "@/app/_helpers/FetchData";
import { getSharedMetadata } from "@/app/_helpers/helpers";
import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
import React from "react";

export async function generateMetadata() {
  const t = await getTranslations("metaSignupPage");
  const sharedMetadata = await getSharedMetadata(t("title"), t("description"));
  return {
    title: t("title"),
    describtion: t("description"),
    ...sharedMetadata,
  };
}

export default async function MembershipPage({ params }: any) {
  const { locale } = await params;

  const user = await FetchData(`/current-user`, false);

  console.log(user);

  if (user) redirect(`/${locale}`);

  return <AccountSelection />;
}
