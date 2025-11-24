import ControlSidebar from "@/app/_components/_website/_controlpanals/ControlSidebar";
import SidbarButton from "@/app/_components/_website/_controlpanals/SidbarButton";
import { getLinks } from "@/app/_components/_website/_navbar/constants";
import FetchData from "@/app/_helpers/FetchData";
import { formatTitle, getSharedMetadata } from "@/app/_helpers/helpers";
import { directionMap } from "@/app/constants/_website/global";
import { getTranslations } from "next-intl/server";
import React from "react";
import { ImStatsBars } from "react-icons/im";

export async function generateMetadata() {
  const t = await getTranslations("metaUserControlPage");
  const sharedMetadata = await getSharedMetadata(t("title"), t("description"));
  return {
    title: t("title"),
    describtion: t("description"),
    ...sharedMetadata,
  };
}

export default async function UserControlPanalLayout({
  children,
  params,
}: any) {
  const user = await FetchData(`/current-user`, false);
  const userLinks = user && user?.account_type == "user" && getLinks(user);

  const promoterRoute = {
    href: `/usercontrolpanel/accountstats?account_type=${
      user?.account_type
    }&userId=${user.id}&account_name=${formatTitle(user.name ?? user.title)}`,
    icon: <ImStatsBars className="size-5" />,
    label: { en: "Promoter Stats", ar: "إحصائيات المروج" },
  };

  const currentLinks =
    user && userLinks && user.promoter
      ? [...userLinks, promoterRoute]
      : userLinks;

  const locale = (await params.locale) ?? "en";
  return (
    <div dir={directionMap[locale]} className="flex items-start gap-3 mt-20">
      <ControlSidebar items={currentLinks ?? []} />
      <SidbarButton />
      {children}
    </div>
  );
}
