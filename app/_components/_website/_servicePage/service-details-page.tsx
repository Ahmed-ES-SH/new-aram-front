"use client";

import { ServiceDetails } from "../../_dashboard/_services/types";
import { useLocale } from "next-intl";
import { directionMap } from "@/app/constants/_website/global";
import { LocaleType } from "@/app/types/_dashboard/GlobalTypes";
import HeroServiceSection from "./HeroServiceSection";
import ServiceFeaturesSection from "./ServiceFeaturesSection";
import TestimonialsCTASection from "./TestimonialsCTASection";
import ServiceOptions from "./ServiceOptions";
import ServiceGallery from "./ServiceGallery";

interface ServiceDetailsPageProps {
  service: ServiceDetails;
}

export default function ServiceDetailsPage({
  service,
}: ServiceDetailsPageProps) {
  const locale = useLocale() as LocaleType;

  const serviceImages = [
    { id: "1", src: "/services/service-1.png", alt: "تنظيف الواجهات الزجاجية" },
    { id: "2", src: "/services/service-2.png", alt: "فريق عمل محترف" },
    { id: "3", src: "/services/service-3.png", alt: "أدوات حديثة" },
    { id: "4", src: "/services/service-man.png", alt: "نتيجة العمل" },
  ];

  return (
    <div dir={directionMap[locale]} className="min-h-screen mt-20">
      <HeroServiceSection />
      <ServiceGallery images={serviceImages} />
      <ServiceOptions />
      <ServiceFeaturesSection />
      <TestimonialsCTASection />
    </div>
  );
}
