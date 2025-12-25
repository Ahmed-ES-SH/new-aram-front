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

export default async function ServicesPage({ params }: any) {
  const { locale } = await params;
  // Fetch service pages from the new endpoint
  const servicesResponse = await FetchData(
    `/service-pages?is_active=true&sort_by=order&sort_order=asc`,
    true
  );
  const categories = await FetchData(`/all-public-categories`, false);

  if (!servicesResponse)
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <p>No Data Found</p>
      </div>
    );

  const { data, pagination } = servicesResponse;

  return (
    <ServicesPageComponent
      categories={categories}
      last_page={pagination?.last_page || 1}
      servicesData={data}
    />
  );
}
