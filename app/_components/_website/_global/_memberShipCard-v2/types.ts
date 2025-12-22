import { Card } from "@/app/_components/_dashboard/_cards/types";
import { Keyword } from "../KeywordSelector";

export type MembershipCardData = Card;

export type Language = "en" | "ar";

export interface TranslationKeys {
  card: {
    memberIdLabel: string;
    joinDateLabel: string;
    validThruLabel: string;
    priceLabel: string;
    originalPriceLabel: string;
    currentPriceLabel: string;
    currencySymbol: string;
    skillsLabel: string;
    addToCart: string;
    viewDetails: string;
    premiumBadge: string;
    exclusiveAccess: string;
  };
}
