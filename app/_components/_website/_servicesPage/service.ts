// types/service.ts
export interface Category {
  id: number;
  title_en: string;
  title_ar: string;
  image: string;
}

export interface User {
  id: number;
  name: string;
  image: string;
}

export interface Keyword {
  id: number;
  title: string;
  created_at: string;
  updated_at: string;
}

export interface Service {
  id: number;
  title: string;
  description: string;
  image: string;
  rating: number;
  orders_count: number;
  active: number;
  order: number;
  status: string;
  benefit_type: string;
  is_exclusive: number;
  discount_percentage: number | null;
  discount_price: number | null;
  exclusive_start_date: string | null;
  exclusive_end_date: string | null;
  user_id: number;
  category_id: number;
  created_at: string;
  updated_at: string;
  category: Category;
  creater: User;
  keywords: Keyword[];
}
