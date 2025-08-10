import * as FaIcons from "react-icons/fa";

export const getIconComponent = (iconName: string) => {
  return FaIcons[iconName as keyof typeof FaIcons] || FaIcons.FaQuestionCircle;
};

export const formatTitle = (title: string) =>
  title.toLowerCase().replace(/\s+/g, "-");

export const getSharedMetadata = (title: string, description: string) => ({
  keywords: [
    "منصة حجز",
    "حجز مراكز طبية",
    "حجز مراكز تجميل",
    "حجز مراكز صحية",
    "حجز مراكز رياضية",
    "عمليات التجميل",
    "بطاقات طبية",
    "بطاقات عضوية",
    "مراكز تجميل",
    "مراكز طبية",
    "منصة صحية",
    "منصة طبية",
    "آرام الخليج المحدودة",
    "جراحة تجميل",
    "خدمات صحية",
    "خدمات تجميل",
    "مراكز علاج طبيعي",
    "حجز مراكز علاجية",
    "بطاقات خصم",
    "خدمات حجز إلكترونية",
  ],
  openGraph: {
    title: title,
    description: description,
    url: `https://aram-gulf.com/en`, // استبدل بالرابط الفعلي إن لزم
    siteName: "Aram Gulf",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    site: "@AramGulf", // ضع معرف تويتر الخاص بالشركة إذا كان متوفرًا
    title: "شركة آرام الخليج المحدودة - منصة الحجز والبطاقات المميزة",
    description:
      "منصة متكاملة لحجوزات المراكز الطبية والتجميلية والصحية والرياضية، مع توفير بطاقات مميزة وخصومات حصرية.",
  },
});
