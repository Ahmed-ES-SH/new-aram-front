import ServicesPageComponent from "@/app/_components/_website/_servicesPage/ServicesPageComponent";
import FetchData from "@/app/_helpers/FetchData";
import { getSharedMetadata } from "@/app/_helpers/helpers";
import { getTranslations } from "next-intl/server";

export async function generateMetadata() {
  const t = await getTranslations("metaServicesPage");
  const sharedMetadata = await getSharedMetadata(t("title"), t("description"));
  return {
    title: t("title"),
    description: t("description"),
    ...sharedMetadata,
  };
}

export default async function ServicesPage() {
  const servicesResponse = await FetchData(`/public-services`, true);
  const categories = await FetchData(`/all-public-categories`, false);

  const { data, pagination } = servicesResponse;

  return (
    <ServicesPageComponent
      servicesData={data}
      categories={categories}
      last_page={pagination.last_page}
    />
  );
}
