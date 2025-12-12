"use client";
import React, { useState } from "react";
import { Translations } from "./types";
import { FaIdCard, FaUtensils, FaGoogle, FaShareAlt } from "react-icons/fa";
import { motion } from "framer-motion";
import { LocaleType } from "@/app/types/_dashboard/GlobalTypes";
import { useLocale } from "next-intl";
import PreviewCard from "./ServicePreviewCard";
import ServiceFeatureItem from "./ServiceFeatureItem";

const translations: Translations = {
  ar: {
    title: "الحل الذكي لكل احتياجاتك",
    subtitle:
      "منتجات أرام مصممة لتجعل التفاعل مع عملائك أسرع، أسهل، وأكثر فخامة.",
    cta: "اضغط للتجربة",
    features: [
      {
        id: "business-card",
        title: "بطاقة الأعمال الذكية",
        description: "شارك بيانات الاتصال، الموقع، وحساباتك بلمسة واحدة.",
        icon: FaIdCard,
        color: "bg-blue-500",
      },
      {
        id: "smart-menu",
        title: "قائمة الطعام الذكية (Menu)",
        description: "عدل الأسعار والأصناف فورياً أونلاين دون إعادة الطباعة.",
        icon: FaUtensils,
        color: "bg-yellow-500",
      },
      {
        id: "google-review",
        title: "بطاقة تقييم جوجل",
        description: "ضاعف تقييماتك 5 نجوم بتسهيل العملية على العميل.",
        icon: FaGoogle,
        color: "bg-red-500",
      },
      {
        id: "social-media",
        title: "منصات التواصل الاجتماعي",
        description: "زد عدد متابعينك على انستجرام، تيك توك وسناب شات.",
        icon: FaShareAlt,
        color: "bg-purple-600",
      },
    ],
  },
  en: {
    title: "The Smart Solution for Your Needs",
    subtitle:
      "Aram products designed to make customer interactions faster, easier, and more luxurious.",
    cta: "Click to Try",
    features: [
      {
        id: "business-card",
        title: "Smart Business Card",
        description:
          "Share contact info, location, and accounts with a single touch.",
        icon: FaIdCard,
        color: "bg-blue-500",
      },
      {
        id: "smart-menu",
        title: "Smart Menu",
        description:
          "Update prices and items instantly online without re-printing.",
        icon: FaUtensils,
        color: "bg-yellow-500",
      },
      {
        id: "google-review",
        title: "Google Review Card",
        description:
          "Double your 5-star ratings by simplifying the process for clients.",
        icon: FaGoogle,
        color: "bg-red-500",
      },
      {
        id: "social-media",
        title: "Social Media Platforms",
        description: "Boost your followers on Instagram, TikTok, and Snapchat.",
        icon: FaShareAlt,
        color: "bg-purple-600",
      },
    ],
  },
};

export default function ServiceOptions() {
  const locale = useLocale() as LocaleType;

  const [activeFeature, setActiveFeature] = useState<string>("social-media");

  const content = translations[locale];
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
            {content.title}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-xl text-slate-500 leading-relaxed max-w-2xl mx-auto"
          >
            {content.subtitle}
          </motion.p>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
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
              ctaText={content.cta}
            />
          </motion.div>

          {/* Right Column: Feature List - Takes up 7 columns on desktop */}
          <div
            className={`lg:col-span-7 flex flex-col gap-4 ${
              locale === "ar" ? "lg:order-2" : "lg:order-1"
            }`}
          >
            {content.features.map((feature, index) => (
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
