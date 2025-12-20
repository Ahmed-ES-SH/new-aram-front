import ServiceDetailsPage from "@/app/_components/_website/_servicePage/service-details-page";
import ServicesSlider from "@/app/_components/_website/_servicesPage/ServiceSlider";
import FetchData from "@/app/_helpers/FetchData";
import { getSharedMetadata } from "@/app/_helpers/helpers";

export async function generateMetadata({ params, searchParams }: any) {
  const { serviceId } = await searchParams;
  const { locale } = await params;
  const service = await FetchData(`/service-pages/${serviceId}`, false);
  const sharedMetadata = await getSharedMetadata(
    service?.slug ?? "",
    service?.description?.slice(0, 100) ?? ""
  );
  return {
    title:
      locale == "en"
        ? `Aram Services - ${service?.slug}`
        : `خدمات أرام - ${service?.slug}`,
    description: service?.description?.slice(0, 100) ?? "",
    ...sharedMetadata,
  };
}

export default async function ServicePage({ searchParams }: any) {
  const { serviceId } = await searchParams;
  const service = await FetchData(`/service-pages/${serviceId}`, false);
  const services = await FetchData(
    `/service-pages?is_active=true&sort_by=order&sort_order=asc`,
    false
  );

  return (
    <>
      <ServiceDetailsPage service={service} />
      <ServicesSlider services={services} />
    </>
  );
}
