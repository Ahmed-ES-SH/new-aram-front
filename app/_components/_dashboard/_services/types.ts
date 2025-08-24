export type Keyword = {
  id: number;
  title: string;
  created_at: string;
  updated_at: string;
};

export type Category = {
  id: number;
  title_en: string;
  title_ar: string;
  image: string;
  bg_color: string;
};

export type image = {
  id: number;
  service_id: number;
  path: string;
};

export type TempImage = {
  file: File;
  tempId: string;
  preview: string;
};

type ImageLike = image | File | TempImage;

export type miniOrg = {
  id: number;
  title: string;
  logo: string;
};

export type Creater = {
  id: number;
  name: string;
  image: string;
};

export type Service = {
  id: number;
  title: string;
  description: string;
  image: string;
  rating: number;
  orders_count: number;
  status: "approved" | "pending" | "rejected" | "suspended";
  benefit_type: "percentage" | "fixed" | "none";
  is_exclusive: 0 | 1;
  discount_percentage: number | null;
  discount_price: number | null;
  exclusive_start_date: string | null;
  exclusive_end_date: string | null;
  user_id: number;
  category_id: number;
  created_at: string;
  updated_at: string;
  organizations: miniOrg[];
  category: Category;
  creater: Creater;
  images: ImageLike[];
  deletedImages?: any;
  keywords: Keyword[];
};

export type FilterState = {
  category: string;
  status: string;
  rating: number;
  searchTerm: string;
};
