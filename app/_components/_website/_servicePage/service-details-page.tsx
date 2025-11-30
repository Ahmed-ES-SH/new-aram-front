"use client";

import { motion } from "framer-motion";
import { HeaderSection } from "./header-section";
import { CreatorCard } from "./creator-card";
import { GallerySlider, serviceImage } from "./gallery-slider";
import { BenefitsList } from "./benefits-list";
import { KeywordsSection } from "./keywords-section";
import { OrganizationsSection } from "./organizations-section";
import { DescriptionSection } from "./description-section";
import { PriceArea } from "./price-area";
import { staggerContainer } from "./animation-variants";
import { Service } from "../../_dashboard/_services/types";
import { useLocale } from "next-intl";
import { directionMap } from "@/app/constants/_website/global";

interface ServiceDetailsPageProps {
  service: Service;
}

export type LocaleType = "en" | "ar";

export default function ServiceDetailsPage({
  service,
}: ServiceDetailsPageProps) {
  const locale = useLocale() as LocaleType;

  return (
    <div dir={directionMap[locale]} className="min-h-screen mt-24">
      {/* Main Content */}
      <motion.main
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="c-container space-y-8"
      >
        {/* Header Section */}
        <HeaderSection service={service} locale={locale} />

        {/* Two Column Layout for Desktop */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Gallery Slider */}
            <GallerySlider images={service.images as serviceImage[]} />

            {/* Description */}
            <DescriptionSection description={service.description} />

            {/* Benefits */}
            <BenefitsList benefits={service.benefits} />

            {/* Keywords */}
            <KeywordsSection keywords={service.keywords} />

            {/* Organizations */}
            <OrganizationsSection organizations={service.organizations} />
          </div>

          {/* Sidebar Column */}
          <div className="space-y-6">
            {/* Sticky Sidebar for Desktop */}
            <div className="lg:sticky lg:top-24 space-y-6">
              {/* Creator Card */}
              <CreatorCard creator={service.creater} />

              {/* Price Area */}
              <PriceArea service={service} />
            </div>
          </div>
        </div>
      </motion.main>

      {/* Footer Spacer */}
      <div className="h-8" />
    </div>
  );
}
