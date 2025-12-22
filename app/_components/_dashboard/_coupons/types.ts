import { category } from "@/app/types/_dashboard/GlobalTypes";

export interface Coupon {
  id: number;
  title: string;
  description: string;
  image: string;
  code: string;
  type: "user" | "organization" | "general";
  benefit_type: "percentage" | "fixed" | "free_card";
  discount_value: number | null;
  start_date: string;
  end_date: string;
  usage_limit: number | null;
  status: "active" | "inactive" | "expired";
  category_id: number;
  created_at: string;
  updated_at: string;
  category: category;
  sub_categories_count: number;
}

export interface Filters {
  category: string;
  status: "active" | "inactive" | "expired" | "";
  benefitType: "percentage" | "fixed" | "free_card" | "";
  type: "user" | "organization" | "general" | "";
  dateFrom: string;
  dateTo: string;
  query: string;
}
