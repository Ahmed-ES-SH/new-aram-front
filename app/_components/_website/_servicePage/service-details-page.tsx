"use client";

import { useLocale } from "next-intl";
import { directionMap } from "@/app/constants/_website/global";
import { LocaleType } from "@/app/types/_dashboard/GlobalTypes";
import HeroServiceSection from "./HeroServiceSection";
import ServiceFeaturesSection from "./ServiceFeaturesSection";
import TestimonialsCTASection from "./TestimonialsCTASection";
import ServiceOptions from "./ServiceOptions";
import ServiceGallery from "./ServiceGallery";
import { Form, VideoFile } from "../../_dashboard/_serviceEditor/types";

// Service page data types matching backend response
interface HeroData {
  id: number | string;
  badge: string;
  title: string;
  subtitle: string;
  description: string;
  watchBtn: string;
  exploreBtn: string;
  heroImage: string;
  backgroundImage: string;
  video?: VideoFile; // Added
  form?: Form; // Added
  serviceSlug?: string;
  price?: number;
  price_before_discount?: number;
}

interface GalleryImage {
  id: string;
  src: string;
  alt: string;
}

interface GalleryData {
  images: GalleryImage[];
  translations: {
    galleryTitle: string;
    viewDetails: string;
    close: string;
    next: string;
    prev: string;
  };
}

interface ProblemItem {
  icon: string;
  title: string;
  description: string;
  // ... other fields
}

interface ProblemSectionData {
  title: string;
  subtitle: string;
  items: ProblemItem[];
}

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
  previewImage: string;
  features: SolutionFeature[];
}

interface StatItem {
  number: string;
  label: string;
}

interface TestimonialItem {
  name: string;
  text: string;
  rating: number;
  avatar?: string;
}

interface TestimonialsData {
  title: string;
  items: TestimonialItem[];
}

interface CTAData {
  ctaTitle: string;
  ctaSubtitle: string;
  ctaButton1: string;
  ctaButton2: string;
}

interface CategoryData {
  id: number;
  title_ar: string;
  title_en: string;
  icon_name: string;
  bg_color: string;
  image: string;
}

export interface ServicePageData {
  id: number;
  slug: string;
  category: CategoryData;
  hero: HeroData;
  gallery: GalleryData;
  problemSection: ProblemSectionData;
  solutionSection: SolutionSectionData;
  stats: StatItem[];
  testimonials: TestimonialsData;
  cta: CTAData;
  video: VideoFile;
  form: Form;
  price?: number;
  price_before_discount?: number;
  whatsapp_number: number | string;
}

interface ServiceDetailsPageProps {
  service: ServicePageData;
}

export default function ServiceDetailsPage({
  service,
}: ServiceDetailsPageProps) {
  const locale = useLocale() as LocaleType;

  // Fallback if service data is missing
  if (!service) {
    return (
      <div
        dir={directionMap[locale]}
        className="min-h-screen mt-20 flex items-center justify-center"
      >
        <p className="text-gray-500">
          {locale === "ar" ? "لم يتم العثور على الخدمة" : "Service not found"}
        </p>
      </div>
    );
  }

  // Create a modified hero data object to include videoUrl and serviceSlug
  const heroDataWithVideoAndSlug: HeroData = {
    ...service.hero,
    id: service.id,
    video: service.video,
    form: service.form,
    serviceSlug: service.slug,
    price: service.price,
    price_before_discount: service.price_before_discount,
  };

  return (
    <div dir={directionMap[locale]} className="min-h-screen mt-20">
      {/* Hero Section */}
      <HeroServiceSection data={heroDataWithVideoAndSlug} />

      {/* Gallery Section */}
      {service.gallery?.images && service.gallery.images.length > 0 && (
        <ServiceGallery
          images={service.gallery.images}
          translations={service.gallery.translations}
        />
      )}

      {/* Problem Section (Features) */}
      {service.problemSection && (
        <ServiceFeaturesSection data={service.problemSection} />
      )}

      {/* Solution Section (Options) */}
      {service.solutionSection && (
        <ServiceOptions data={service.solutionSection} />
      )}

      {/* Testimonials, Stats & CTA Section */}
      <TestimonialsCTASection
        stats={service.stats}
        testimonials={service.testimonials}
        cta={service.cta}
        whatsappNumber={service.whatsapp_number}
        serviceId={service.id}
      />
    </div>
  );
}
