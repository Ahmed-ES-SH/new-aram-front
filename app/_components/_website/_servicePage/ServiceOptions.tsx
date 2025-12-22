"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { LocaleType } from "@/app/types/_dashboard/GlobalTypes";
import { useLocale } from "next-intl";
import PreviewCard from "./ServicePreviewCard";
import ServiceFeatureItem from "./ServiceFeatureItem";

interface SolutionFeature {
  id: string;
  icon: string;
  color: string;
  title: string;
  description: string;
  image: string;
}

interface SolutionSectionData {
  title: string;
  subtitle: string;
  cta: string;
  previewImage?: string;
  features: SolutionFeature[];
}

interface ServiceOptionsProps {
  data?: SolutionSectionData;
}

export default function ServiceOptions({ data }: ServiceOptionsProps) {
  const locale = useLocale() as LocaleType;

  const [activeFeature, setActiveFeature] = useState<string>("");
  const [featuresImages, setFeaturesImages] = useState<string[]>([]);

  useEffect(() => {
    if (!data?.features) return;

    const images = data.features.reduce<Record<string, string>>(
      (acc, feature) => {
        acc[feature.id] = feature.image;
        return acc;
      },
      {}
    );

    setActiveFeature(data.features[0].id);

    setFeaturesImages(images as any);
  }, [data]);

  return (
    <div
      className={`min-h-screen bg-white text-slate-900 font-sans selection:bg-purple-200 selection:text-primary`}
    >
      <main className="container mx-auto px-4 py-12 lg:py-20">
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-16 lg:mb-24">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 mb-6 leading-tight"
          >
            {data?.title ?? ""}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-xl text-slate-500 leading-relaxed max-w-2xl mx-auto"
          >
            {data?.subtitle ?? ""}
          </motion.p>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Interactive Preview (Phone) - Takes up 5 columns on desktop */}
          <motion.div
            className={`lg:col-span-5 h-full ${
              locale === "ar" ? "lg:order-1" : "lg:order-2"
            }`}
            initial={{ opacity: 0, x: locale === "ar" ? 50 : -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <PreviewCard
              activeFeatureId={activeFeature}
              ctaText={data?.cta ?? ""}
              previewImage={
                featuresImages[activeFeature] ??
                "/images/categories/Environment.png"
              }
            />
          </motion.div>

          {/* Right Column: Feature List - Takes up 7 columns on desktop */}
          <div
            className={`lg:col-span-7 flex flex-col gap-4 ${
              locale === "ar" ? "lg:order-2" : "lg:order-1"
            }`}
          >
            {data?.features &&
              Array.isArray(data?.features) &&
              data?.features.length > 0 &&
              data?.features.map((feature, index) => (
                <motion.div
                  key={feature.id}
                  initial={{ opacity: 0, x: 0, y: 20 }}
                  whileInView={{ opacity: 1, x: 0, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <ServiceFeatureItem
                    item={feature}
                    isActive={activeFeature === feature.id}
                    onClick={() => setActiveFeature(feature.id)}
                  />
                </motion.div>
              ))}
          </div>
        </div>
      </main>
    </div>
  );
}
