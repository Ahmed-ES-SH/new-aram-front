export type Keyword = {
  id: number;
  title: string;
  created_at: string;
  updated_at: string;
};

export type Category = {
  id: number;
  title_en: string;
  title_ar: string;
  image: string;
  bg_color: string;
};

export type image = {
  id: number;
  service_id: number;
  path: string;
};

export type TempImage = {
  file: File;
  tempId: string;
  preview: string;
};

type ImageLike = image | File | TempImage;

export type miniOrg = {
  id: number;
  title: string;
  logo: string;
};

export type creater = {
  id: number;
  name: string;
  image: string;
};

export interface ServiceDetails {
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

export interface GallerySection {
  translations: {
    galleryTitle: string;
    viewDetails: string;
    close: string;
    next: string;
    [key: string]: string; // Future-proof for extra translations
  };
  images: GalleryImage[];
}

export interface GalleryImage {
  id: string;
  src: string;
  alt: string;
}

export interface ProblemSection {
  title: string;
  subtitle: string;
  items: ProblemItem[];
}

export interface ProblemItem {
  icon: string;
  title: string;
  description: string;
}

export interface SolutionSection {
  title: string;
  subtitle: string;
  cta: string;
  // Add more fields if backend sends more
  [key: string]: any;
}

export interface StatItem {
  number: string;
  label: string;
}

export interface TestimonialsSection {
  title: string;
  items: Testimonial[];
}

export interface Testimonial {
  name: string;
  text: string;
  rating: number;
  avatar: string;
}

export interface CTASection {
  ctaTitle: string;
  ctaSubtitle: string;
  ctaButton1: string;
  ctaButton2: string;
}

type benfit = {
  id: number;
  title: string;
  service_id: number;
  created_at: string;
  updated_at: string;
};

export type FilterState = {
  category: string;
  status: string;
  rating: number;
  searchTerm: string;
};
