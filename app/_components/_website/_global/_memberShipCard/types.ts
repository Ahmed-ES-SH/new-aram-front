import { Keyword } from "../KeywordSelector";

// types/membership-card.ts
export interface MembershipCardData {
  id: number;
  title: string;
  description: string;
  price_before_discount: number;
  price: number;
  keywords: Keyword[];
  image: string;
  member_id?: string;
  member_level?: string;
  join_date?: string;
  expiry_date?: string;
}

export interface MembershipCardProps {
  data: MembershipCardData;
  onAddToCart?: () => void;
  onViewDetails?: () => void;
}

export interface HoverActionsProps {
  isVisible: boolean;
  onAddToCart: () => void;
  onViewDetails: () => void;
  addToCartText: string;
  viewDetailsText: string;
}
