import { LocalizedText } from "../../_dashboard/_serviceEditor/types";
import { FieldType } from "./types";

// Map external field types to internal types
export const mapFieldType = (type: string): FieldType => {
  const map: Record<string, FieldType> = {
    text: "short_text",
    textarea: "long_text",
    email: "email",
    number: "number",
    phone: "phone",
    url: "url",
    select: "dropdown",
    checkbox: "checkbox",
    radio: "radio",
    multiselect: "multi_select",
    date: "date",
    time: "time",
    datetime: "datetime",
    file: "file_upload",
    image: "image_upload",
  };
  return map[type] || "short_text";
};

// Helper to get localized string
export const getLocalized = (
  text: LocalizedText | undefined | null,
  locale: string
): string => {
  if (!text) return "";
  if (typeof text === "string") return text;
  return (text as any)[locale] || (text as any)["en"] || "";
};
