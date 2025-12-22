import React from "react";
import { getLinks } from "@/app/_components/_website/_navbar/constants";
import { formatTitle, getSharedMetadata } from "@/app/_helpers/helpers";
import { directionMap } from "@/app/constants/_website/global";
import { getTranslations } from "next-intl/server";
import { ImStatsBars } from "react-icons/im";
import FetchData from "@/app/_helpers/FetchData";
import ControlSidebar from "@/app/_components/_website/_controlpanals/ControlSidebar";
import SidbarButton from "@/app/_components/_website/_controlpanals/SidbarButton";
import ProductAuthRoutes from "@/app/_components/_productRoutes/ProductAuthRoutes";

export async function generateMetadata() {
  const t = await getTranslations("metaUserControlPage");
  const sharedMetadata = await getSharedMetadata(t("title"), t("description"));
  return {
    title: t("title"),
    description: t("description"),
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

  const { locale } = await params;
  return (
    <ProductAuthRoutes locale={locale}>
      <div
        dir={directionMap[locale ?? "en"]}
        className="flex items-start gap-3 mt-20"
      >
        <ControlSidebar items={currentLinks ?? []} />
        <SidbarButton />
        {children}
      </div>
    </ProductAuthRoutes>
  );
}
