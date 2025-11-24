import ControlSidebar from "@/app/_components/_website/_controlpanals/ControlSidebar";
import SidbarButton from "@/app/_components/_website/_controlpanals/SidbarButton";
import { getOrganizationLinks } from "@/app/_components/_website/_navbar/constants";
import FetchData from "@/app/_helpers/FetchData";
import { formatTitle, getSharedMetadata } from "@/app/_helpers/helpers";
import { directionMap } from "@/app/constants/_website/global";
import { getTranslations } from "next-intl/server";
import React from "react";
import { ImStatsBars } from "react-icons/im";

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
  const promoterRoute = {
    href: `/centercontrolpanel/accountstats?account_type=${
      user?.account_type
    }&userId=${user.id}&account_name=${formatTitle(user.name ?? user.title)}`,
    icon: <ImStatsBars className="size-5" />,
    label: { en: "Promoter Stats", ar: "إحصائيات المروج" },
  };

  const links = user ? getOrganizationLinks(user) : [];
  const centerLinks =
    user && links && user.promoter ? [...links, promoterRoute] : links;

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
