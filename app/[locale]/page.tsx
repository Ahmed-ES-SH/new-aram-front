import AboutSection from "../_components/_website/_home/AboutSection";
import CardsSection from "../_components/_website/_home/CardsSection";
import ServicesSection from "../_components/_website/_home/ServicesSection";
import ContactForm from "../_components/_website/_home/ConatctForm";
import HeroSection from "../_components/_website/_home/HeroSection";
import FetchData from "../_helpers/FetchData";
import BlogSection from "../_components/_website/_home/_articles-section-v2/BlogSection";
import { CentersSection } from "../_components/_website/_home/_organizations_v2";
import { StatsSection } from "../_components/_website/_home/_stats_v2/StatsSection";

export default async function Home() {
  const mainSectionsData = await FetchData("/get-main-sections", false);

  if (!mainSectionsData) {
    return <div>لا يوجد بيانات</div>;
  }

  const { cards_section, centers_section, services_section, stats_section } =
    mainSectionsData;

  // about section data
  const aboutData = await FetchData(`/get-section/2`, false);

  // cards data
  const cardsData = await FetchData(`/public-cards?limit=8`, false);

  // orgaizations data
  const organizationsData = await FetchData(
    `/active-organizations?limit=8`,
    false
  );

  // services data (using new service-pages endpoint)
  const servicePages = await FetchData(
    `/service-pages?is_active=true&per_page=8&sort_by=order&sort_order=asc`,
    true
  );

  // articles data
  const articlesData = await FetchData(`/top-ten-articles`, false);

  return (
    <div className="overflow-hidden max-lg:mt-20">
      {/* Hero section */}
      <HeroSection />

      {/* About section */}
      <AboutSection data={aboutData} />

      <CardsSection cards={cardsData} staticData={cards_section.data ?? []} />

      <CentersSection
        organizations={organizationsData}
        staticData={centers_section.data ?? []}
      />

      <ServicesSection
        initialServices={servicePages?.data || []}
        staticData={services_section.data ?? []}
      />

      <StatsSection staticData={stats_section.data ?? []} />

      <BlogSection articles={articlesData} />

      <ContactForm />
    </div>
  );
}
