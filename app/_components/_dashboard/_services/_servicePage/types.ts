// Types for ServicePage miniature data

export interface ServicePageCategory {
  id: number;
  title_en: string;
  title_ar: string;
  icon_name: string;
  image?: string;
}

export interface ServicePageMiniature {
  id: number;
  slug: string;
  is_active: boolean;
  title: string;
  image: string;
  price: string;
  price_before_discount: string | null;
  type: "service" | "product";
  category: ServicePageCategory;
  status: "active" | "inactive" | "pending";
  created_at: string;
  updated_at: string;
}

export type SortByOptions =
  | "created_at"
  | "price"
  | "order"
  | "slug"
  | "updated_at";
export type SortOrderOptions = "asc" | "desc";

export interface ServicePageFilters {
  // Category
  category_id: string;
  // Type
  type: string;
  // Status
  status: string;
  // Active state
  is_active: string;
  // Price range
  min_price: string;
  max_price: string;
  // Search
  search: string;
  // Date range
  from_date: string;
  to_date: string;
  // Sorting
  sort_by: SortByOptions;
  sort_order: SortOrderOptions;
}

export const DEFAULT_FILTERS: ServicePageFilters = {
  category_id: "",
  type: "",
  status: "",
  is_active: "",
  min_price: "",
  max_price: "",
  search: "",
  from_date: "",
  to_date: "",
  sort_by: "order",
  sort_order: "asc",
};
