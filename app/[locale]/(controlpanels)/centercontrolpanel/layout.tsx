import ControlSidebar from "@/app/_components/_website/_controlpanals/ControlSidebar";
import SidbarButton from "@/app/_components/_website/_controlpanals/SidbarButton";
import { getOrganizationLinks } from "@/app/_components/_website/_navbar/constants";
import FetchData from "@/app/_helpers/FetchData";
import { getSharedMetadata } from "@/app/_helpers/helpers";
import { directionMap } from "@/app/constants/_website/global";
import { getTranslations } from "next-intl/server";
import React from "react";

export async function generateMetadata() {
  const t = await getTranslations("metaCenterControlPage");
  const sharedMetadata = await getSharedMetadata(t("title"), t("description"));
  return {
    title: t("title"),
    describtion: t("description"),
    ...sharedMetadata,
  };
}

export default async function CenterControlPanalLayout({
  children,
  params,
}: any) {
  const user = await FetchData(`/current-user`, false);
  const centerLinks = user ? getOrganizationLinks(user) : [];

  console.log(user);

  const locale = (await params.locale) ?? "en";
  return (
    <div
      dir={directionMap[locale]}
      className="flex items-start gap-3 mt-20  hidden-scrollbar"
    >
      <ControlSidebar items={centerLinks as any} />
      <SidbarButton />
      {children}
    </div>
  );
}
