export interface StatItem {
  id: number;
  title: string;
  value: string;
  icon: string;
  change: number;
}

export interface ChartDataPoint {
  month: string;
  value: number;
}

export const mockCards = [
  {
    id: 1,
    title: "Premium Web Development",
    description:
      "Complete web development solution with modern technologies and responsive design. Perfect for businesses looking to establish a strong online presence.",
    price_before_discount: "$2,999",
    price: "$1,999",
    number_of_promotional_purchases: 15,
    duration: "30 days",
    image: "/mockdata/web-development-workspace.png",
    active: 1,
    category_id: 1,
    created_at: "2024-01-15T10:00:00Z",
    updated_at: "2024-01-20T15:30:00Z",
    keywords_count: 8,
    services_count: 5,
    benefits_count: 12,
    keywords: [
      { id: 1, title: "React" },
      { id: 2, title: "TypeScript" },
      { id: 3, title: "Responsive" },
    ],
  },
  {
    id: 2,
    title: "Digital Marketing Package",
    description:
      "Comprehensive digital marketing strategy including SEO, social media management, and content creation to boost your online visibility.",
    price_before_discount: "$1,499",
    price: "$999",
    number_of_promotional_purchases: 23,
    duration: "60 days",
    image: "/mockdata/digital-marketing-dashboard.png",
    active: 1,
    category_id: 2,
    created_at: "2024-01-10T08:00:00Z",
    updated_at: "2024-01-18T12:00:00Z",
    keywords_count: 6,
    services_count: 4,
    benefits_count: 10,
    keywords: [
      { id: 4, title: "SEO" },
      { id: 5, title: "Social Media" },
      { id: 6, title: "Analytics" },
    ],
  },
  {
    id: 3,
    title: "Mobile App Development",
    description:
      "Native and cross-platform mobile application development for iOS and Android with modern UI/UX design principles.",
    price_before_discount: "$4,999",
    price: "$3,499",
    number_of_promotional_purchases: 8,
    duration: "45 days",
    image: "/mockdata/mobile-app-development-mockup.png",
    active: 1,
    category_id: 3,
    created_at: "2024-01-12T14:00:00Z",
    updated_at: "2024-01-22T09:15:00Z",
    keywords_count: 10,
    services_count: 6,
    benefits_count: 15,
    keywords: [
      { id: 7, title: "React Native" },
      { id: 8, title: "iOS" },
      { id: 9, title: "Android" },
    ],
  },
];

export const mockOrganizations = [
  {
    id: 1,
    title: "TechCorp Solutions",
    description:
      "Leading technology solutions provider specializing in enterprise software development and digital transformation services.",
    email: "contact@techcorp.com",
    location: { address: "New York, NY" },
    phone_number: "+1-555-0123",
    confirmation_price: "$500",
    status: "published",
    active: 1,
    rating: "4.8",
    number_of_reservations: 156,
    category: {
      id: 1,
      title_en: "Technology",
      title_ar: "التكنولوجيا",
      bg_color: "#3B82F6",
      icon_name: "laptop",
    },
    logo: "/abstract-tech-logo.png",
    image: "/mockdata/modern-office-building.png",
    keywords: [
      { id: 1, title: "Software Development" },
      { id: 2, title: "Cloud Solutions" },
    ],
  },
  {
    id: 2,
    title: "Creative Design Studio",
    description:
      "Award-winning design studio creating beautiful and functional designs for brands worldwide. Specializing in branding and digital experiences.",
    email: "hello@creativedesign.com",
    location: { address: "Los Angeles, CA" },
    phone_number: "+1-555-0456",
    confirmation_price: "$300",
    status: "published",
    active: 1,
    rating: "4.9",
    number_of_reservations: 89,
    category: {
      id: 2,
      title_en: "Design",
      title_ar: "التصميم",
      bg_color: "#EC4899",
      icon_name: "palette",
    },
    logo: "/creative-design-studio-logo.png",
    image: "/mockdata/creative-design-workspace.png",
    keywords: [
      { id: 3, title: "Branding" },
      { id: 4, title: "UI/UX Design" },
    ],
  },
  {
    id: 3,
    title: "Marketing Experts Inc",
    description:
      "Full-service marketing agency helping businesses grow through strategic marketing campaigns and data-driven insights.",
    email: "info@marketingexperts.com",
    location: { address: "Chicago, IL" },
    phone_number: "+1-555-0789",
    confirmation_price: "$400",
    status: "published",
    active: 1,
    rating: "4.7",
    number_of_reservations: 203,
    category: {
      id: 3,
      title_en: "Marketing",
      title_ar: "التسويق",
      bg_color: "#10B981",
      icon_name: "trending-up",
    },
    logo: "/marketing-agency-logo.png",
    image: "/mockdata/marketing-team-meeting.png",
    keywords: [
      { id: 5, title: "Digital Marketing" },
      { id: 6, title: "Analytics" },
    ],
  },
];

export const mockServices = [
  {
    id: 1,
    title: "E-commerce Website Development",
    description:
      "Build a complete e-commerce solution with payment integration, inventory management, and modern design.",
    image: "/mockdata/ecommerce-website-mockup.png",
    rating: 4.8,
    orders_count: 45,
    status: "approved",
    benefit_type: "percentage",
    is_exclusive: 1,
    discount_percentage: 25,
    discount_price: null,
    exclusive_start_date: "2024-01-01T00:00:00Z",
    exclusive_end_date: "2024-03-31T23:59:59Z",
    user_id: 1,
    category_id: 1,
    created_at: "2024-01-15T10:00:00Z",
    updated_at: "2024-01-20T15:30:00Z",
    organizations: [
      { id: 1, title: "TechCorp Solutions", logo: "/abstract-tech-logo.png" },
    ],
    category: {
      id: 1,
      title_en: "Web Development",
      title_ar: "تطوير المواقع",
      bg_color: "#3B82F6",
      icon_name: "code",
    },
    creater: {
      id: 1,
      name: "John Smith",
      image: "/mockdata/developer-profile.png",
    },
    images: [
      { id: 1, url: "/ecommerce-mockup-1.png" },
      { id: 2, url: "/ecommerce-mockup-2.png" },
    ],
    keywords: [
      { id: 1, title: "E-commerce" },
      { id: 2, title: "Payment Integration" },
      { id: 3, title: "Responsive Design" },
    ],
  },
  {
    id: 2,
    title: "Brand Identity Design",
    description:
      "Complete brand identity package including logo design, color palette, typography, and brand guidelines.",
    image: "/mockdata/brand-identity-design-showcase.png",
    rating: 4.9,
    orders_count: 32,
    status: "approved",
    benefit_type: "fixed",
    is_exclusive: 0,
    discount_percentage: null,
    discount_price: 200,
    exclusive_start_date: null,
    exclusive_end_date: null,
    user_id: 2,
    category_id: 2,
    created_at: "2024-01-10T08:00:00Z",
    updated_at: "2024-01-18T12:00:00Z",
    organizations: [
      {
        id: 2,
        title: "Creative Design Studio",
        logo: "/design-studio-logo.png",
      },
    ],
    category: {
      id: 2,
      title_en: "Design",
      title_ar: "التصميم",
      bg_color: "#EC4899",
      icon_name: "palette",
    },
    creater: {
      id: 2,
      name: "Sarah Johnson",
      image: "/mockdata/designer-profile.png",
    },
    images: [
      { id: 3, url: "/brand-identity-showcase-1.png" },
      { id: 4, url: "/brand-identity-showcase-2.png" },
    ],
    keywords: [
      { id: 4, title: "Logo Design" },
      { id: 5, title: "Brand Guidelines" },
      { id: 6, title: "Visual Identity" },
    ],
  },
  {
    id: 3,
    title: "SEO Optimization Service",
    description:
      "Comprehensive SEO audit and optimization to improve your website's search engine rankings and organic traffic.",
    image: "/mockdata/seo-analytics-dashboard.png",
    rating: 4.7,
    orders_count: 67,
    status: "approved",
    benefit_type: "none",
    is_exclusive: 0,
    discount_percentage: null,
    discount_price: null,
    exclusive_start_date: null,
    exclusive_end_date: null,
    user_id: 3,
    category_id: 3,
    created_at: "2024-01-12T14:00:00Z",
    updated_at: "2024-01-22T09:15:00Z",
    organizations: [
      {
        id: 3,
        title: "Marketing Experts Inc",
        logo: "/abstract-marketing-logo.png",
      },
    ],
    category: {
      id: 3,
      title_en: "Marketing",
      title_ar: "التسويق",
      bg_color: "#10B981",
      icon_name: "trending-up",
    },
    creater: {
      id: 3,
      name: "Mike Wilson",
      image: "/mockdata/marketer-profile.png",
    },
    images: [
      { id: 5, url: "/seo-report-1.png" },
      { id: 6, url: "/seo-report-2.png" },
    ],
    keywords: [
      { id: 7, title: "SEO" },
      { id: 8, title: "Keyword Research" },
      { id: 9, title: "Content Optimization" },
    ],
  },
];

export const mockArticles = [
  {
    id: 1,
    title_en: "The Future of Web Development: Trends to Watch in 2024",
    title_ar: "مستقبل تطوير المواقع: الاتجاهات التي يجب مراقبتها في 2024",
    content_en:
      "Web development continues to evolve rapidly with new technologies and frameworks emerging...",
    content_ar:
      "يستمر تطوير المواقع في التطور بسرعة مع ظهور تقنيات وأطر عمل جديدة...",
    views: 1250,
    image: "/mockdata/web-development-trends-2024.png",
    status: true,
    created_at: "2024-01-15T10:00:00Z",
    comments_count: 23,
    interactions: [{ totalReactions: 156 }],
    author: {
      id: 1,
      name: "Alex Thompson",
      image: "/mockdata/tech-writer-profile.png",
    },
    category: {
      id: 1,
      title_en: "Technology",
      title_ar: "التكنولوجيا",
      bg_color: "#3B82F6",
      icon_name: "laptop",
    },
  },
  {
    id: 2,
    title_en: "Design Systems: Building Consistent User Experiences",
    title_ar: "أنظمة التصميم: بناء تجارب مستخدم متسقة",
    content_en:
      "Design systems have become essential for maintaining consistency across digital products...",
    content_ar:
      "أصبحت أنظمة التصميم ضرورية للحفاظ على الاتساق عبر المنتجات الرقمية...",
    views: 890,
    image: "/mockdata/design-system-components.png",
    status: true,
    created_at: "2024-01-12T14:30:00Z",
    comments_count: 18,
    interactions: [{ totalReactions: 124 }],
    author: {
      id: 2,
      name: "Emma Davis",
      image: "/mockdata/designer-profile.png",
    },
    category: {
      id: 2,
      title_en: "Design",
      title_ar: "التصميم",
      bg_color: "#EC4899",
      icon_name: "palette",
    },
  },
  {
    id: 3,
    title_en: "Digital Marketing Strategies for Small Businesses",
    title_ar: "استراتيجيات التسويق الرقمي للشركات الصغيرة",
    content_en:
      "Small businesses can compete with larger companies by implementing effective digital marketing strategies...",
    content_ar:
      "يمكن للشركات الصغيرة أن تنافس الشركات الكبيرة من خلال تنفيذ استراتيجيات تسويق رقمي فعالة...",
    views: 2100,
    image: "/mockdata/small-business-digital-marketing.png",
    status: true,
    created_at: "2024-01-10T09:15:00Z",
    comments_count: 35,
    interactions: [{ totalReactions: 287 }],
    author: {
      id: 3,
      name: "David Rodriguez",
      image: "/mockdata/marketing-expert-profile.png",
    },
    category: {
      id: 3,
      title_en: "Marketing",
      title_ar: "التسويق",
      bg_color: "#10B981",
      icon_name: "trending-up",
    },
  },
];

export const mockStats = [
  {
    id: 1,
    title: "Total Users",
    value: "25,847",
    icon: "users",
    change: 12.5,
  },
  {
    id: 2,
    title: "Organizations",
    value: "1,234",
    icon: "building",
    change: 8.2,
  },
  {
    id: 3,
    title: "Services Sold",
    value: "15,692",
    icon: "shopping-bag",
    change: 15.7,
  },
  {
    id: 4,
    title: "Monthly Revenue",
    value: "$847K",
    icon: "dollar-sign",
    change: 23.1,
  },
];

export const mockChartData: ChartDataPoint[] = [
  { month: "Jan", value: 4000 },
  { month: "Feb", value: 3000 },
  { month: "Mar", value: 5000 },
  { month: "Apr", value: 4500 },
  { month: "May", value: 6000 },
  { month: "Jun", value: 5500 },
  { month: "Jul", value: 7000 },
  { month: "Aug", value: 6500 },
  { month: "Sep", value: 8000 },
  { month: "Oct", value: 7500 },
  { month: "Nov", value: 9000 },
  { month: "Dec", value: 8500 },
];
