import { Promoter, PromotionActivity } from "./types";

export const mockPromoterData: Promoter = {
  id: "promo_001",
  name: "أحمد محمد",
  email: "ahmed@example.com",
  referralCode: "AHMED2024",
  discountPercent: 15,
  isActive: true,
  createdAt: new Date("2024-01-15"),
};

const countries = [
  "السعودية",
  "الإمارات",
  "مصر",
  "الأردن",
  "الكويت",
  "قطر",
  "البحرين",
];
const devices = ["موبايل", "حاسوب", "تابلت"];
const memberNames = [
  "محمد علي",
  "سارة أحمد",
  "خالد عبدالله",
  "نورة محمد",
  "فهد سعود",
  "هند عمر",
  "عبدالرحمن خالد",
  "لمى يوسف",
];

function generateRandomIP(): string {
  return `${Math.floor(Math.random() * 255)}.${Math.floor(
    Math.random() * 255
  )}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
}

function generateRandomDate(daysBack: number): Date {
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * daysBack));
  date.setHours(Math.floor(Math.random() * 24), Math.floor(Math.random() * 60));
  return date;
}

const ips = Array.from({ length: 20 }, generateRandomIP);

export const mockActivityData: PromotionActivity[] = Array.from(
  { length: 200 },
  (_, i) => {
    const typeRandom = Math.random();
    let type: "visit" | "registration" | "purchase";
    if (typeRandom < 0.6) type = "visit";
    else if (typeRandom < 0.85) type = "registration";
    else type = "purchase";

    const activity: PromotionActivity = {
      id: `act_${i + 1}`,
      promoterId: "promo_001",
      type,
      country: countries[Math.floor(Math.random() * countries.length)],
      device: devices[Math.floor(Math.random() * devices.length)],
      ip: ips[Math.floor(Math.random() * ips.length)],
      createdAt: generateRandomDate(30),
    };

    if (type === "purchase") {
      const orderAmount = Math.floor(Math.random() * 500 + 50);
      activity.commission = Math.floor(orderAmount * 0.1);
      activity.orderAmount = orderAmount;
      activity.referredMemberId = `member_${Math.floor(Math.random() * 8) + 1}`;
      activity.referredMemberName =
        memberNames[Math.floor(Math.random() * memberNames.length)];
      activity.referredMemberEmail = `${activity.referredMemberName
        ?.split(" ")[0]
        .toLowerCase()}@example.com`;
    }

    if (type === "registration") {
      activity.referredMemberId = `member_${Math.floor(Math.random() * 8) + 1}`;
      activity.referredMemberName =
        memberNames[Math.floor(Math.random() * memberNames.length)];
      activity.referredMemberEmail = `${activity.referredMemberName
        ?.split(" ")[0]
        .toLowerCase()}@example.com`;
    }

    return activity;
  }
).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
