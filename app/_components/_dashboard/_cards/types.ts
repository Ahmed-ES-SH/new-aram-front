import { category } from "@/app/types/_dashboard/GlobalTypes";

export interface Keyword {
  id: number;
  title: string;
}

export interface Card {
  id: number;
  title: string;
  description: string;
  price_before_discount: string;
  price: string;
  number_of_promotional_purchases: number;
  duration: string;
  image: string;
  active: number;
  category_id: number;
  created_at: string;
  updated_at: string;
  order: number;
  keywords_count: number;
  services_count: number;
  benefits_count: number;
  keywords: Keyword[];
  category: category;
}
