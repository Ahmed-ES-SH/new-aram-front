export interface Organization {
  id: number;
  title: string;
  description: string;
  image: string;
  rating: string;
}

export interface Category {
  id: number;
  title_en: string;
  title_ar: string;
  bg_color: string;
  icon_name: string;
  image: string;
  is_active: number;
}

export interface Offer {
  id: number;
  title: string;
  description: string;
  image: string;
  number_of_uses: number;
  discount_type: "percentage" | "fixed";
  discount_value: string;
  code: string;
  start_date: string;
  end_date: string;
  status: "active" | "inactive" | "expired";
  organization: Organization;
  category: Category;
  usage_limit: number;
}
