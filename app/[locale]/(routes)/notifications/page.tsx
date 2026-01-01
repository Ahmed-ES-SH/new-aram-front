import NotificationsPage from "@/app/_components/_website/_notifications/NotificationsPage";
import FetchData from "@/app/_helpers/FetchData";
import { getSharedMetadata } from "@/app/_helpers/helpers";
import { getTranslations } from "next-intl/server";

export async function generateMetadata() {
  const t = await getTranslations("metaNotificationsPage");
  const sharedMetadata = await getSharedMetadata(t("title"), t("description"));
  return {
    title: t("title"),
    description: t("description"),
    ...sharedMetadata,
  };
}

export default async function Notifications({ searchParams }: any) {
  const { userId, account_type, page } = await searchParams;

  const response = await FetchData(
    `/notifications/${userId}/${account_type}?page=${page}`,
    true
  );

  const { data, pagination } = await response;

  return <NotificationsPage notifications={data} pagination={pagination} />;
}
