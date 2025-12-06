// types/center.ts
export interface Center {
  id: number;
  image: string;
  logo: string;
  order: number;
  number_of_reservations: number;
  rating: string;
  open_at: string;
  close_at: string;
  title: string;
  description: string;
  confirmation_price: string;
  confirmation_status: number;
  booking_status: number;
  sub_categories_count: number;
  benefits_count: number;
  category: {
    id: number;
    title_en: string;
    title_ar: string;
    bg_color: string;
    icon_name: string;
  };
  categories: any[];
  keywords: Keyword[];
}

export interface Keyword {
  id: number;
  title: string;
}

export interface Category {
  id: number;
  title_en: string;
  title_ar: string;
  bg_color: string;
  icon_name: string;
}
