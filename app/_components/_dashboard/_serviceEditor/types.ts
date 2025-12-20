// TypeScript interfaces for Service Page Editor

// Type for image fields that can be URL string, File object, or null
export type ImageValue = string | File | null;

export interface GalleryTranslations {
  galleryTitle: string;
  viewDetails: string;
  close: string;
  next: string;
  prev: string;
}

export interface SolutionFeature {
  id: string;
  icon: string;
  color: string;
  title: string;
  description: string;
}

export interface TestimonialItem {
  name: string;
  text: string;
  rating: number;
  avatar: ImageValue;
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

export type SectionType =
  | "hero_section"
  | "gallery_images"
  | "problem_section"
  | "solution_section"
  | "stats"
  | "testimonials"
  | "cta"
  | "contact_messages";

export const SECTION_LABELS: Record<SectionType, { ar: string; en: string }> = {
  hero_section: { ar: "القسم الرئيسي", en: "Hero Section" },
  gallery_images: { ar: "معرض الصور", en: "Gallery" },
  problem_section: { ar: "قسم المشكلة", en: "Problem Section" },
  solution_section: { ar: "قسم الحل", en: "Solution Section" },
  stats: { ar: "الإحصائيات", en: "Statistics" },
  testimonials: { ar: "آراء العملاء", en: "Testimonials" },
  cta: { ar: "دعوة للإجراء", en: "Call to Action" },
  contact_messages: { ar: "رسائل الاتصال", en: "Contact Messages" },
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

// types.ts
// Type definitions for the service page payload returned by the API.
// Comments are in English as requested.

export interface Category {
  id: number;
  title_ar: string;
  title_en: string;
  // optional locale
  icon_name?: string | null; // e.g. "FaChartLine"
  image?: string | null; // full URL
  bg_color?: string | null; // e.g. "#6AA3D0"
  is_active?: boolean | number;
  created_at?: string;
  updated_at?: string;
}

export interface GalleryImage {
  id: number | string;
  service_page_id?: number;
  path: string | File | null; // might be relative path or full url
  order?: number;
  alt_ar?: string | null;
  alt_en?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface GalleryTranslation {
  id: number;
  service_page_id: number;
  gallery_title_ar?: string | null;
  gallery_title_en?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface HeroSection {
  id?: number;
  service_page_id?: number;
  badge_ar?: string | null;
  badge_en?: string | null;
  title_ar?: string | null;
  title_en?: string | null;
  subtitle_ar?: string | null;
  subtitle_en?: string | null;
  description_ar?: string | null;
  description_en?: string | null;

  hero_image?: string | null; // url or relative path
  background_image?: string | null; // url or relative path
  created_at?: string;
  updated_at?: string;
}

export interface CtaSection {
  id?: number;
  service_page_id?: number;
  cta_title_ar?: string | null;
  cta_title_en?: string | null;
  cta_subtitle_ar?: string | null;
  cta_subtitle_en?: string | null;
  cta_button1_ar?: string | null;
  cta_button1_en?: string | null;
  cta_button2_ar?: string | null;
  cta_button2_en?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface ProblemItem {
  id: number;
  problem_section_id?: number;
  icon?: string | null;
  title_ar?: string | null;
  title_en?: string | null;
  description_ar?: string | null;
  description_en?: string | null;
  order?: number;
  created_at?: string;
  updated_at?: string;
}

export interface ProblemSection {
  id?: number;
  service_page_id?: number;
  title_ar?: string | null;
  title_en?: string | null;
  subtitle_ar?: string | null;
  subtitle_en?: string | null;
  items?: ProblemItem[];
  created_at?: string;
  updated_at?: string;
}

export interface FeatureItem {
  id: number;
  solution_section_id?: number;
  feature_key?: string | null;
  icon?: string | null; // e.g. "FaIdCard"
  color?: string | null; // e.g. "bg-blue-500"
  title_ar: string | null;
  title_en: string | null;
  description_ar?: string | null;
  description_en?: string | null;
  preview_image?: ImageValue;
  order?: number;
  created_at?: string;
  updated_at?: string;
}

export interface SolutionSection {
  id?: number;
  service_page_id?: number;
  title_ar?: string | null;
  title_en?: string | null;
  cta_text_ar?: string | null;
  cta_text_en?: string | null;
  subtitle_en?: string | null;
  subtitle_ar?: string | null;
  features?: FeatureItem[];
  created_at?: string;
  updated_at?: string;
}

export interface StatItem {
  id: number;
  service_page_id?: number;
  number: string;
  label_ar?: string | null;
  label_en?: string | null;
  order?: number;
  created_at?: string;
  updated_at?: string;
}

export interface Testimonial {
  id: number;
  service_page_id?: number;
  name_ar?: string | null;
  name_en?: string | null;
  avatar?: string | null; // path or url
  text_ar?: string | null;
  text_en?: string | null;
  rating?: number;
  order?: number;
  created_at?: string;
  updated_at?: string;
}

export interface FeatureSummary {
  id: number;
  service_page_id?: number;
  color?: string | null;
  feature_key?: string | null;
  icon?: string | null;
  description_ar?: string | null;
  description_en?: string | null;
  order?: number;
  created_at?: string;
  updated_at?: string;
}

export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  phone: string;
  message: string;
  status: string;
  service_page_id: number;
  created_at: string;
  updated_at: string;
}

// Service page data interface matching new types
export interface ServicePageData {
  id: number;
  slug: string;
  hero_section: HeroSection;
  gallery_images: GalleryImage[];
  problem_section: ProblemSection;
  solution_section: SolutionSection;
  stats: StatItem[];
  testimonials: Testimonial[];
  deleted_images: GalleryImage[];
  testimonials_images: GalleryImage[];
  cta_section: CtaSection;
  contact_messages: ContactMessage[];
  price: number | string;
  price_before_discount: number | string;
  category_id: number;
  whatsapp_number: number | string;
  type: "one_time" | "subscription";
  order: number;
  main_video: string | File | null;
  is_active: boolean | number;
  video: VideoFile;
  form: Form;
  created_at?: string;
  updated_at?: string;
}

export interface VideoFile {
  id: number;
  video_id: string;
  video_image: string | null;
  video_url: string;
  aspect_ratio: string;
  video_type: string;
  is_file: number;
  created_at?: string;
  updated_at?: string;
}

export interface LocalizedTextObject {
  ar: string;
  en: string;
}

export type LocalizedText = string | LocalizedTextObject;

export interface FormOption {
  label: LocalizedText;
  value: string | number;
}

export interface Form {
  id: number;
  title: string; // Keep as string or upgrade to LocalizedText if valid? Keeping string based on previous user input "title: string".
  name?: string; // Add name if needed
  fields: FormField[];
}

export interface FormField {
  id: string;
  name: string;
  type: string;
  label: LocalizedText; // Was string
  placeholder?: LocalizedText; // Was string
  required: boolean;
  width?: string;
  rows?: number | null;
  options?: FormOption[]; // Was string[]
  order: number;
  accept?: string | null;
  validation?: any;
  visibility?: any;
}

export interface ServicePageEditorProps {
  mode: "create" | "edit";
}

export type activeSectionType = SectionType | "settings" | "form";

/**
 * Main ServicePage detail shape that matches the provided payload.
 * Many fields are optional because the API may return partial objects.
 */
export interface ServicePageDetail {
  id: number;
  service_page_id?: number;
  slug?: string;
  type?: string; // e.g. "service"
  status?: string; // e.g. "active"
  title_ar?: string;
  title_en?: string;
  subtitle_ar?: string | null;
  subtitle_en?: string | null;
  price?: string | number | null;
  price_before_discount?: string | number | null;
  is_active?: boolean | number;
  order?: number;
  preview_image?: string | null;

  // relations
  category?: Category | null;
  category_id?: number;

  hero_section?: HeroSection | null;
  gallery_images?: GalleryImage[];
  gallery_translation?: GalleryTranslation | null;
  cta_section?: CtaSection | null;
  problem_section?: ProblemSection | null;
  solution_section?: SolutionSection | null;
  features?: FeatureSummary[]; // short list of features
  stats?: StatItem[];
  testimonials?: Testimonial[];

  created_at?: string;
  updated_at?: string;

  // allow additional unknown fields
  [key: string]: any;
}
