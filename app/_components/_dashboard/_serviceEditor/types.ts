// TypeScript interfaces for Service Page Editor

export interface HeroSection {
  badge: string;
  title: string;
  subtitle: string;
  description: string;
  watchBtn: string;
  exploreBtn: string;
  heroImage: string;
  backgroundImage: string;
}

export interface GalleryImage {
  id: string;
  src: string;
  alt: string;
}

export interface GalleryTranslations {
  galleryTitle: string;
  viewDetails: string;
  close: string;
  next: string;
  prev: string;
}

export interface GallerySection {
  translations: GalleryTranslations;
  images: GalleryImage[];
}

export interface ProblemItem {
  icon: string;
  title: string;
  description: string;
}

export interface ProblemSection {
  title: string;
  subtitle: string;
  items: ProblemItem[];
}

export interface SolutionFeature {
  id: string;
  icon: string;
  color: string;
  title: string;
  description: string;
}

export interface SolutionSection {
  title: string;
  subtitle: string;
  cta: string;
  previewImage: string;
  features: SolutionFeature[];
}

export interface StatItem {
  number: string;
  label: string;
}

export interface TestimonialItem {
  name: string;
  text: string;
  rating: number;
  avatar: string;
}

export interface TestimonialsSection {
  title: string;
  items: TestimonialItem[];
}

export interface CTASection {
  ctaTitle: string;
  ctaSubtitle: string;
  ctaButton1: string;
  ctaButton2: string;
}

export interface ServicePageData {
  id: number;
  slug: string;
  hero: HeroSection;
  gallery: GallerySection;
  problemSection: ProblemSection;
  solutionSection: SolutionSection;
  stats: StatItem[];
  testimonials: TestimonialsSection;
  cta: CTASection;
}

export type SectionType =
  | "hero"
  | "gallery"
  | "problem"
  | "solution"
  | "stats"
  | "testimonials"
  | "cta";

export const SECTION_LABELS: Record<SectionType, { ar: string; en: string }> = {
  hero: { ar: "القسم الرئيسي", en: "Hero Section" },
  gallery: { ar: "معرض الصور", en: "Gallery" },
  problem: { ar: "قسم المشكلة", en: "Problem Section" },
  solution: { ar: "قسم الحل", en: "Solution Section" },
  stats: { ar: "الإحصائيات", en: "Statistics" },
  testimonials: { ar: "آراء العملاء", en: "Testimonials" },
  cta: { ar: "دعوة للإجراء", en: "Call to Action" },
};

export const AVAILABLE_ICONS = [
  "star",
  "book",
  "dollar",
  "check",
  "heart",
  "shield",
  "clock",
  "users",
  "globe",
  "phone",
  "mail",
  "location",
];

export const ICON_COLORS = [
  "bg-blue-500",
  "bg-red-500",
  "bg-green-500",
  "bg-yellow-500",
  "bg-purple-500",
  "bg-pink-500",
  "bg-indigo-500",
  "bg-orange-500",
];
