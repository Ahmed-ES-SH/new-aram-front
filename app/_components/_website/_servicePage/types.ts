export interface FeatureData {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
}

export interface Content {
  title: string;
  subtitle: string;
  cta: string;
  features: FeatureData[];
}

export interface Translations {
  ar: Content;
  en: Content;
}
