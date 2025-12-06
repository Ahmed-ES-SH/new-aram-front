"use client";
import { Service } from "../../_dashboard/_services/types";
import { directionMap } from "@/app/constants/_website/global";
import { useLocale, useTranslations } from "next-intl";
import ServiceCard from "../_services/ServiceCard";
import { ServicesHeader } from "./_services_v2/ServicesHeader";

interface ServicesSectionProps {
  services: Service[];
}

export default function ServicesSection({ services }: ServicesSectionProps) {
  const locale = useLocale();
  const t = useTranslations("services");
  return (
    <section
      dir={directionMap[locale]}
      className="py-16 px-4 c-container bg-white"
    >
      <ServicesHeader />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-8">
        {services.map((service) => (
          <ServiceCard
            service={service}
            key={`${service.id}+${service.title}`}
          />
        ))}
      </div>
    </section>
  );
}
