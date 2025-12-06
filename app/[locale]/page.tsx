import React from "react";
import AboutSection from "../_components/_website/_home/AboutSection";
import CardsSection from "../_components/_website/_home/CardsSection";
import ServicesSection from "../_components/_website/_home/ServicesSection";
import ContactForm from "../_components/_website/_home/ConatctForm";
import HeroSection from "../_components/_website/_home/HeroSection";
import FetchData from "../_helpers/FetchData";
import { CentersSection } from "../_components/_website/_home/_organizations_v2";
import { StatsSection } from "../_components/_website/_home/_stats_v2/StatsSection";
import BlogSection from "../_components/_website/_home/_articles-section-v2/BlogSection";

export default async function Home() {
  // about section data
  const aboutData = await FetchData(`/get-section/2`, false);

  // cards data
  const cardsData = await FetchData(`/public-cards?limit=8`, false);

  // orgaizations data
  const organizationsData = await FetchData(
    `/active-organizations?limit=8`,
    false
  );

  // services data
  const servicesData = await FetchData(`/active-services`, false);

  // articles data
  const articlesData = await FetchData(`/top-ten-articles`, false);

  return (
    <div className="overflow-hidden max-lg:mt-20">
      {/* Hero section */}
      <HeroSection />

      {/* About section */}
      <AboutSection data={aboutData} />

      <CardsSection cards={cardsData} />

      {/* <OrganizationsSection organizations={organizationsData} /> */}

      <CentersSection organizations={organizationsData} />

      <ServicesSection services={servicesData} />

      <StatsSection />

      <BlogSection articles={articlesData} />

      <ContactForm />
    </div>
  );
}
