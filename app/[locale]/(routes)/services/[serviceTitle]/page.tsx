import ServiceDetailsPage from "@/app/_components/_website/_servicePage/service-details-page";
import ServicesSlider from "@/app/_components/_website/_servicesPage/ServiceSlider";
import FetchData from "@/app/_helpers/FetchData";
import { getSharedMetadata } from "@/app/_helpers/helpers";

export async function generateMetadata({ searchParams, params }: any) {
  const { serviceId } = await searchParams;
  const { locale } = await params;
  const service = await FetchData(`/get-service/${serviceId}`, false);
  const sharedMetadata = await getSharedMetadata(
    service?.title ?? "",
    service?.description?.slice(0, 100) ?? ""
  );
  return {
    title:
      locale == "en"
        ? `Aram Services - ${service?.title}`
        : `خدمات أرام - ${service?.title}`,
    description: service?.description?.slice(0, 100) ?? "",
    ...sharedMetadata,
  };
}

export default async function ServicePage({ searchParams }: any) {
  const { serviceId } = await searchParams;
  const service = await FetchData(`/get-service/${serviceId}`, false);
  const services = await FetchData(`/public-services`, false);

  return (
    <>
      <ServiceDetailsPage service={service} />
      {/* <ServicesSlider
        services={services}
        title="خدماتنا"
        subtitle="اكتشف مجموعة خدماتنا المميزة"
      /> */}
    </>
  );
}
