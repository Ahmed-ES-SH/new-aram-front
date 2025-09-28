import type { Article, Category } from "./types";

export const mockCategories: Category[] = [
  {
    id: 1,
    title_en: "Technology",
    title_ar: "التكنولوجيا",
    image: "/technology-icon.png",
    created_at: "2025-08-30T19:02:40.000000Z",
    updated_at: "2025-08-30T19:02:40.000000Z",
  },
  {
    id: 2,
    title_en: "Health",
    title_ar: "الصحة",
    image: "/health-medical-icon.jpg",
    created_at: "2025-08-30T19:02:40.000000Z",
    updated_at: "2025-08-30T19:02:40.000000Z",
  },
  {
    id: 3,
    title_en: "Science",
    title_ar: "العلوم",
    image: "/science-laboratory-icon.jpg",
    created_at: "2025-08-30T19:02:40.000000Z",
    updated_at: "2025-08-30T19:02:40.000000Z",
  },
  {
    id: 4,
    title_en: "Business",
    title_ar: "الأعمال",
    image: "/business-finance-icon.jpg",
    created_at: "2025-08-30T19:02:40.000000Z",
    updated_at: "2025-08-30T19:02:40.000000Z",
  },
];

export const mockArticles: Article[] = [
  {
    id: 1,
    image: "/fresh-orange-juice-glass-dark-background.jpg",
    status: "published",
    views: 1250,
    category_id: 2,
    author_id: 8,
    title_en: "The Health Benefits of Fresh Orange Juice",
    title_ar: "الفوائد الصحية لعصير البرتقال الطازج",
    content_en:
      "Discover the amazing health benefits of drinking fresh orange juice daily and how it can boost your immune system...",
    content_ar:
      "اكتشف الفوائد الصحية المذهلة لشرب عصير البرتقال الطازج يومياً وكيف يمكن أن يعزز جهاز المناعة...",
    created_at: "2025-08-30T19:02:40.000000Z",
    updated_at: "2025-08-30T19:02:40.000000Z",
    author: {
      id: 8,
      name: "Dr. Sarah Johnson",
      image: "/professional-woman-doctor.png",
    },
    category: {
      id: 2,
      title_en: "Health",
      title_ar: "الصحة",
      image: "/health-medical-icon.jpg",
      created_at: "2025-08-30T19:02:40.000000Z",
      updated_at: "2025-08-30T19:02:40.000000Z",
    },
  },
  {
    id: 2,
    image: "assets/images/posts/trending-1.png",
    status: "published",
    views: 2100,
    category_id: 1,
    author_id: 5,
    title_en: "The Future of Artificial Intelligence",
    title_ar: "مستقبل الذكاء الاصطناعي",
    content_en:
      "Exploring the latest developments in AI technology and what the future holds for machine learning...",
    content_ar:
      "استكشاف أحدث التطورات في تكنولوجيا الذكاء الاصطناعي وما يحمله المستقبل للتعلم الآلي...",
    created_at: "2025-08-29T15:30:20.000000Z",
    updated_at: "2025-08-29T15:30:20.000000Z",
    author: {
      id: 5,
      name: "Alex Chen",
      image: "/tech-professional-man.png",
    },
    category: {
      id: 1,
      title_en: "Technology",
      title_ar: "التكنولوجيا",
      image: "/technology-icon.png",
      created_at: "2025-08-30T19:02:40.000000Z",
      updated_at: "2025-08-30T19:02:40.000000Z",
    },
  },
  {
    id: 3,
    image: "/space-exploration-mars-rover.jpg",
    status: "published",
    views: 890,
    category_id: 3,
    author_id: 12,
    title_en: "Mars Exploration: Latest Discoveries",
    title_ar: "استكشاف المريخ: أحدث الاكتشافات",
    content_en:
      "Recent findings from Mars rovers reveal fascinating insights about the red planet's history and potential for life...",
    content_ar:
      "الاكتشافات الحديثة من مركبات استكشاف المريخ تكشف رؤى مذهلة حول تاريخ الكوكب الأحمر وإمكانية الحياة...",
    created_at: "2025-08-28T10:15:30.000000Z",
    updated_at: "2025-08-28T10:15:30.000000Z",
    author: {
      id: 12,
      name: "Dr. Maria Rodriguez",
      image: "/scientist-woman.jpg",
    },
    category: {
      id: 3,
      title_en: "Science",
      title_ar: "العلوم",
      image: "/science-laboratory-icon.jpg",
      created_at: "2025-08-30T19:02:40.000000Z",
      updated_at: "2025-08-30T19:02:40.000000Z",
    },
  },
];

export const popularTags = [
  { en: "Technology", ar: "التكنولوجيا" },
  { en: "Health", ar: "الصحة" },
  { en: "Science", ar: "العلوم" },
  { en: "Innovation", ar: "الابتكار" },
  { en: "Research", ar: "البحث" },
  { en: "Future", ar: "المستقبل" },
];
