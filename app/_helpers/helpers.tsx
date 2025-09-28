import * as FaIcons from "react-icons/fa";
import crypto from "crypto";

export const getIconComponent = (iconName: string) => {
  return FaIcons[iconName as keyof typeof FaIcons] || FaIcons.FaQuestionCircle;
};

export const formatTitle = (title?: string) => {
  if (!title || title.trim() === "") {
    return "no-title"; // fallback slug if no title is provided
  }

  return title.toLowerCase().replace(/\s+/g, "-");
};

export const truncateContent = (text: string, maxLength = 120) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
};

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
    url: `https://aram-gulf.com/ar`, // استبدل بالرابط الفعلي إن لزم
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

const ALGORITHM = "aes-256-cbc";

export function encryptToken(token: string) {
  const key = crypto
    .createHash("sha256")
    .update(process.env.NEXT_PUBLIC_ENCRYPTION_KEY!)
    .digest();
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  let encrypted = cipher.update(token, "utf8", "hex");
  encrypted += cipher.final("hex");
  return iv.toString("hex") + ":" + encrypted; // حفظ IV مع النص المشفر
}

export function decryptToken(encryptedToken: string) {
  const key = crypto
    .createHash("sha256")
    .update(process.env.NEXT_PUBLIC_ENCRYPTION_KEY!)
    .digest();
  const [ivHex, encrypted] = encryptedToken.split(":");
  const iv = Buffer.from(ivHex, "hex");
  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  let decrypted = decipher.update(encrypted, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}
