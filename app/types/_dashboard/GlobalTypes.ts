export interface subCategory {
  id: number;
  title_en: string;
  title_ar: string;
  image: string;
  bg_color: string;
  icon_name: string;
}

export interface category {
  id: number;
  title_en: string;
  title_ar: string;
  image: string;
  bg_color: string;
  icon_name: string;
  subcategories?: subCategory[];
  sub_categories?: subCategory[];
  sub_categories_count: number;
  organizations_count: number;
  parent_id?: number;
  parent: {
    id: number;
    title_en: string;
    title_ar: string;
    image: string;
  };
}

export interface UserType {
  id: number;
  name: string;
  email: string;
  image: string;
  phone: string;
  gender: string;
  created_at: string;
}

interface item {
  name: string;
  type: string;
  label: { ar: string; en: string };
}

export interface InputField {
  readOnly?: boolean;
  name: string;
  type: string;
  fildType: string;
  displayKey?: string;
  label: { ar: string; en: string };
  placeholder?: string;
  items?: item[];
  selectItems?: { [key: string]: string }[];
}

export interface errorType {
  [key: string]: { ar: string; en: string };
}

export interface ArticleType {
  id: number;
  title_en: string;
  title_ar: string;
  content_en: string;
  content_ar: string;
  views: number;
  image: string;
  status: boolean;
  created_at: string;
  comments_count: number;
  interactions: [{ totalReactions: number }];
  author: {
    id: number;
    name: string;
    image: string;
  };
  category: category;
}
