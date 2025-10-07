export interface LocationType {
  address: string;
  coordinates: {
    lat: number;
    lang: number;
  };
}

export type Category = {
  id: number;
  title_en: string;
  title_ar: string;
  icon_name: string;
  bg_color: string;
};

type benefit = {
  id: number;
  title: string;
};
export interface Organization {
  id: number;
  title: string;
  description: string;
  email: string;
  location: LocationType;
  phone_number: string;
  confirmation_price: string;
  status: "published" | "under_review" | "not_published";
  active: number;
  order: number;
  open_at: string;
  close_at: string;
  account_type: string;
  url: string;
  rating: string | number;
  category_id: number;
  booking_status: boolean | number;
  confirmation_status: boolean | number;
  number_of_reservations: number;
  category: {
    id: number;
    title_en: string;
    title_ar: string;
    bg_color: string;
    icon_name: string;
  };
  benefits: benefit[];
  logo: string;
  image: string;
  keywords: { id: number; title: string }[];
}

export interface FilterState {
  categories: number[];
  status: string[];
  rating: number;
  active: boolean | null;
  search: string;
}
