// TypeScript interfaces for organization profile data structure

export interface Category {
  id: number;
  title_en: string;
  title_ar: string;
  bg_color: string;
  icon_name: string;
}

export interface SubCategory {
  id: number;
  title_en: string;
  title_ar: string;
  bg_color: string;
  icon_name: string;
  image: string;
}

export interface Benefit {
  id: number;
  title: string;
}

export interface Keyword {
  id: number;
  title: string;
}

export interface Location {
  address: string;
  coordinates: {
    lat: number;
    lang: number;
  };
}

export interface Organization {
  id: number;
  title: string;
  description: string;
  email: string;
  phone_number: string;
  logo: string;
  image: string;
  url: string;
  account_type: string;
  rating: string;
  number_of_reservations: number;
  status: string;
  active: number;
  is_signed: number;
  booking_status: number;
  confirmation_status: number;
  confirmation_price: string;
  accaptable_message: string;
  unaccaptable_message: string;
  open_at: string;
  close_at: string;
  location: Location;
  category: Category;
  sub_categories: SubCategory[];
  benefits: Benefit[];
  keywords: Keyword[];
  created_at: string;
  updated_at: string;
}

// Form data type excluding non-editable fields
export type OrganizationFormData = Omit<
  Organization,
  | "id"
  | "status"
  | "active"
  | "created_at"
  | "updated_at"
  | "account_type"
  | "rating"
  | "number_of_reservations"
  | "is_signed"
  | "booking_status"
  | "confirmation_status"
>;
