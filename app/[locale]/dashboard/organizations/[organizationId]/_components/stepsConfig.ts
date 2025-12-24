import {
  FaImage,
  FaInfoCircle,
  FaMapMarkerAlt,
  FaCog,
  FaList,
  FaStar,
  FaEnvelope,
} from "react-icons/fa";
import { IconType } from "react-icons";

export interface StepConfig {
  id: string;
  label: string;
  icon: IconType;
  fields: string[];
}

export const STEPS: StepConfig[] = [
  {
    id: "images",
    label: "الصور والشعار",
    icon: FaImage,
    fields: ["logo", "image"],
  },
  {
    id: "basic",
    label: "المعلومات الأساسية",
    icon: FaInfoCircle,
    fields: ["title", "description", "email", "phone_number", "url"],
  },
  {
    id: "location",
    label: "الموقع والعنوان",
    icon: FaMapMarkerAlt,
    fields: ["location", "location.address"],
  },
  {
    id: "settings",
    label: "الإعدادات والحالة",
    icon: FaCog,
    fields: [
      "status",
      "active",
      "booking_status",
      "confirmation_status",
      "confirmation_price",
      "open_at",
      "close_at",
    ],
  },
  {
    id: "categories",
    label: "التصنيفات",
    icon: FaList,
    fields: ["categories", "sub_categories"],
  },
  {
    id: "extra",
    label: "بيانات إضافية",
    icon: FaStar,
    fields: ["keywords", "benefits"],
  },
  {
    id: "messages",
    label: "رسائل الحجز",
    icon: FaEnvelope,
    fields: ["accaptable_message", "unaccaptable_message"],
  },
];
