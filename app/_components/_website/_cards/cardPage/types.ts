import { Card } from "@/app/_components/_dashboard/_cards/types";
import { IconType } from "react-icons";

export interface CardPageProps {
  card: Card;
}

export interface HeroSectionProps {
  card: Card;
  locale: string;
  CategoryIcon: IconType | null;
}

export interface BenefitsSectionProps {
  benefits: Card["benefits"];
  locale: string;
  t: (key: string) => string;
}

export interface KeywordsSectionProps {
  keywords: Card["keywords"];
  locale: string;
  t: (key: string) => string;
}

export interface ShareSectionProps {
  locale: string;
  t: (key: string) => string;
  onShare: (platform: string) => void;
}

export interface PricingSidebarProps {
  card: Card;
  locale: string;
  t: (key: string) => string;
  activeCurrency: any;
  discountPercentage: number;
  savedPrice: number;
  isInCart: boolean;
  onAddToCart: () => void;
  onCouponClick: () => void;
}
