"use client";
import React from "react";
import HeroVideo from "../_components/_website/_home/hero-video";
import AboutSection from "../_components/_website/_home/AboutSection";
import CardsSection from "../_components/_website/_home/CardsSection";
import OrganizationsSection from "../_components/_website/_home/OrganizationsSection";
import ServicesSection from "../_components/_website/_home/ServicesSection";
import StatsSection from "../_components/_website/_home/StatsSection";
import BlogSection from "../_components/_website/_home/BlogSection";
import { useLocale, useTranslations } from "next-intl";
import {
  mockArticles,
  mockCards,
  mockOrganizations,
  mockServices,
  mockStats,
} from "../constants/_website/mockData";
import ContactForm from "../_components/_website/_home/ConatctForm";

export default function Home() {
  const locale = useLocale();
  const t = useTranslations();

  return (
    <>
      <HeroVideo />

      {/* About section */}
      <AboutSection
        title={t("about.title")}
        subtitle={t("about.subtitle")}
        description={t("about.description")}
        features={t.raw("about.features")}
        locale={locale}
      />

      <CardsSection
        title={t("homeCards.title")}
        subtitle={t("homeCards.subtitle")}
        cards={mockCards} // لو عندك قائمة كروت في ملف json
        locale={locale}
      />

      <OrganizationsSection
        title={t("organizations.title")}
        subtitle={t("organizations.subtitle")}
        organizations={mockOrganizations} // لو جايه من json بدل mock
        locale={locale}
      />

      <ServicesSection
        title={t("services.title")}
        subtitle={t("services.subtitle")}
        services={mockServices} // مصفوفة خدمات
        locale={locale}
      />

      <StatsSection
        title={t("stats.title")}
        subtitle={t("stats.subtitle")}
        stats={mockStats} // مصفوفة إحصائيات
        locale={locale}
      />

      <BlogSection
        title={t("blog.title")}
        subtitle={t("blog.subtitle")}
        articles={mockArticles} // مقالات من json
        locale={locale}
      />

      <ContactForm />
    </>
  );
}
