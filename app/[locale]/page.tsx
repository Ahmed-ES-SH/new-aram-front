import React from "react";
import AboutSection from "../_components/_website/_home/AboutSection";
import CardsSection from "../_components/_website/_home/CardsSection";
import OrganizationsSection from "../_components/_website/_home/OrganizationsSection";
// import ServicesSection from "../_components/_website/_home/ServicesSection";
import StatsSection from "../_components/_website/_home/StatsSection";
import BlogSection from "../_components/_website/_home/BlogSection";
import ContactForm from "../_components/_website/_home/ConatctForm";
import HeroSection from "../_components/_website/_home/HeroSection";
import FetchData from "../_helpers/FetchData";
import { mockStats } from "../constants/_website/mockData";

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
  // const servicesData = await FetchData(`/active-services`, false);

  // articles data
  const articlesData = await FetchData(`/top-ten-articles`, false);

  return (
    <>
      {/* Hero section */}
      <HeroSection />

      {/* About section */}
      <AboutSection data={aboutData} />

      <CardsSection cards={cardsData} />

      <OrganizationsSection organizations={organizationsData} />

      {/* <ServicesSection services={servicesData} /> */}

      <StatsSection stats={mockStats} />

      <BlogSection articles={articlesData} />

      <ContactForm />
    </>
  );
}
