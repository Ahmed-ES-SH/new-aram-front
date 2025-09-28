export interface Article {
  id: number;
  image: string;
  status: string;
  views: number;
  category_id: number;
  author_id: number;
  created_at: string;
  updated_at: string;
  title_en: string;
  title_ar: string;
  content_en: string;
  content_ar: string;
  tags_count: number;
  interactions: {
    loves: number;
    likes: number;
    dislikes: number;
    laughters: number;
    totalReactions: number;
  };
  author: {
    id: number;
    name: string;
    image: string;
  };
  category: {
    id: number;
    title_en: string;
    title_ar: string;
    image: string;
    created_at: string;
    updated_at: string;
  };
  tags: tag[];
}

export interface tag {
  id: number;
  tag: string;
}

export interface Category {
  id: number;
  title_en: string;
  title_ar: string;
  image: string;
  created_at: string;
  updated_at: string;
}
