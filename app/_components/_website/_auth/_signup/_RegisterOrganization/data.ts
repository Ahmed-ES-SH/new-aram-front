export interface Category {
  id: string;
  name: string;
  subcategories: Subcategory[];
}

export interface Subcategory {
  id: string;
  name: string;
  categoryId: string;
}

export const MOCK_CATEGORIES: Category[] = [
  {
    id: "sports",
    name: "Sports & Fitness",
    subcategories: [
      { id: "gym", name: "Gym", categoryId: "sports" },
      { id: "pool", name: "Swimming Pool", categoryId: "sports" },
      { id: "tennis", name: "Tennis Court", categoryId: "sports" },
      { id: "football", name: "Football Field", categoryId: "sports" },
    ],
  },
  {
    id: "wellness",
    name: "Health & Wellness",
    subcategories: [
      { id: "spa", name: "Spa", categoryId: "wellness" },
      { id: "yoga", name: "Yoga Studio", categoryId: "wellness" },
      { id: "massage", name: "Massage Center", categoryId: "wellness" },
    ],
  },
  {
    id: "entertainment",
    name: "Entertainment",
    subcategories: [
      { id: "cinema", name: "Cinema", categoryId: "entertainment" },
      { id: "theater", name: "Theater", categoryId: "entertainment" },
      { id: "arcade", name: "Arcade", categoryId: "entertainment" },
    ],
  },
  {
    id: "education",
    name: "Education",
    subcategories: [
      { id: "library", name: "Library", categoryId: "education" },
      { id: "training", name: "Training Center", categoryId: "education" },
      { id: "workshop", name: "Workshop Space", categoryId: "education" },
    ],
  },
];
