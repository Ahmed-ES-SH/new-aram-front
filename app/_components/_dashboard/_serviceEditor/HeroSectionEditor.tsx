"use client";

import React from "react";
import { FiLayout } from "react-icons/fi";
import EditableField from "./EditableField";
import ImageUploader from "./ImageUploader";
import { HeroSection } from "./types";

/**
 * Editor for a hero/service page section with multilingual fields.
 */

interface HeroSectionEditorProps {
  data: HeroSection;
  onChange: (data: HeroSection, field: string) => void;
}

export default function HeroSectionEditor({
  data,
  onChange,
}: HeroSectionEditorProps) {
  // Generic field updater for text fields
  const updateField = (field: keyof HeroSection, value: string) => {
    onChange({ ...data, [field]: value }, "hero_section");
  };

  // Image field updater - can receive File, string URL, or null
  const updateImage = (
    field: keyof HeroSection,
    value: string | File | null
  ) => {
    onChange({ ...data, [field]: value }, "hero_section");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <FiLayout className="text-primary" size={20} />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900">
            القسم الرئيسي (Hero)
          </h3>
          <p className="text-sm text-gray-500">
            تعديل المحتوى الظاهر في أعلى الصفحة (multilingual)
          </p>
        </div>
      </div>

      {/* Badge (2 locales) */}
      <div>
        <h4 className="mb-2 text-sm font-semibold text-gray-700">
          الشارة (Badge)
        </h4>
        <div className="grid grid-cols-1  gap-4">
          <EditableField
            label="Badge — العربية (ar)"
            value={data.badge_ar ?? ""}
            onChange={(v) => updateField("badge_ar", v)}
            placeholder="مثال: الحل الجديد من التسويق الذكي"
          />
          <EditableField
            label="Badge — English (en)"
            value={data.badge_en ?? ""}
            onChange={(v) => updateField("badge_en", v)}
            placeholder="Example: New Smart Marketing Solution"
          />
        </div>
      </div>

      {/* Titles (2 locales) */}
      <div>
        <h4 className="mb-2 text-sm font-semibold text-gray-700">
          العنوان الرئيسي (Title)
        </h4>
        <div className="grid grid-cols-1  gap-4">
          <EditableField
            label="Title — العربية (ar)"
            value={data.title_ar ?? ""}
            onChange={(v) => updateField("title_ar", v)}
            placeholder="مثال: لمسة واحدة.."
          />
          <EditableField
            label="Title — English (en)"
            value={data.title_en ?? ""}
            onChange={(v) => updateField("title_en", v)}
            placeholder="Example: One Touch.."
          />
        </div>
      </div>

      {/* Subtitles (2 locales) */}
      <div>
        <h4 className="mb-2 text-sm font-semibold text-gray-700">
          العنوان الفرعي (Subtitle)
        </h4>
        <div className="grid grid-cols-1  gap-4">
          <EditableField
            label="Subtitle — العربية (ar)"
            value={data.subtitle_ar ?? ""}
            onChange={(v) => updateField("subtitle_ar", v)}
            placeholder="مثال: عالم من الفرص"
          />
          <EditableField
            label="Subtitle — English (en)"
            value={data.subtitle_en ?? ""}
            onChange={(v) => updateField("subtitle_en", v)}
            placeholder="Example: A World of Opportunities"
          />
        </div>
      </div>

      {/* Descriptions (2 locales) */}
      <div>
        <h4 className="mb-2 text-sm font-semibold text-gray-700">
          الوصف (Description)
        </h4>
        <div className="grid grid-cols-1 gap-4">
          <EditableField
            label="Description — العربية (ar)"
            value={data.description_ar ?? ""}
            onChange={(v) => updateField("description_ar", v)}
            type="textarea"
            placeholder="مثال: استبدل البطاقات الورقية ببطاقات NFC الذكية..."
          />
          <EditableField
            label="Description — English (en)"
            value={data.description_en ?? ""}
            onChange={(v) => updateField("description_en", v)}
            type="textarea"
            placeholder="Example: Replace paper cards with smart NFC cards..."
          />
        </div>
      </div>

      {/* Images */}
      <div>
        <h4 className="mb-2 text-sm font-semibold text-gray-700">
          الصور (Images)
        </h4>
        <div className="grid grid-cols-1  gap-6">
          <ImageUploader
            label="صورة الرئيسية (Hero Image)"
            value={data.hero_image ?? ""}
            onChange={(v) => updateImage("hero_image", v)}
          />
        </div>
      </div>
    </div>
  );
}
