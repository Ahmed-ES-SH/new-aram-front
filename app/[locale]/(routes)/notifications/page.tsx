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
  const userId = searchParams.userId;
  const accountType = searchParams.account_type;
  const page = searchParams.page ?? 1;

  const { data, pagination } = await FetchData(
    `/notifications/${userId}/${accountType}?page=${page}`,
    true
  );

  return <NotificationsPage notifications={data} pagination={pagination} />;
}
