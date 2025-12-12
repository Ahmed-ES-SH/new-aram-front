"use client";
import { HeroSection } from "./types";
import EditableField from "./EditableField";
import ImageUploader from "./ImageUploader";
import { FiLayout } from "react-icons/fi";

interface HeroSectionEditorProps {
  data: HeroSection;
  onChange: (data: HeroSection) => void;
}

export default function HeroSectionEditor({
  data,
  onChange,
}: HeroSectionEditorProps) {
  const updateField = (field: keyof HeroSection, value: string) => {
    onChange({ ...data, [field]: value });
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
            تعديل المحتوى الظاهر في أعلى الصفحة
          </p>
        </div>
      </div>

      {/* Badge & Titles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <EditableField
          label="الشارة (Badge)"
          value={data.badge}
          onChange={(v) => updateField("badge", v)}
          placeholder="مثال: الحل الجديد من التسويق الذكي"
        />
        <EditableField
          label="العنوان الرئيسي"
          value={data.title}
          onChange={(v) => updateField("title", v)}
          placeholder="مثال: لمسة واحدة.."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <EditableField
          label="العنوان الفرعي"
          value={data.subtitle}
          onChange={(v) => updateField("subtitle", v)}
          placeholder="مثال: عالم من الفرص"
        />
      </div>

      {/* Description */}
      <EditableField
        label="الوصف"
        value={data.description}
        onChange={(v) => updateField("description", v)}
        type="textarea"
        placeholder="وصف تفصيلي للخدمة..."
      />

      {/* Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <EditableField
          label="نص زر المشاهدة"
          value={data.watchBtn}
          onChange={(v) => updateField("watchBtn", v)}
          placeholder="مثال: شاهد كيف تعمل"
        />
        <EditableField
          label="نص زر الاستكشاف"
          value={data.exploreBtn}
          onChange={(v) => updateField("exploreBtn", v)}
          placeholder="مثال: اكتشف المنتجات"
        />
      </div>

      {/* Images */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ImageUploader
          label="صورة البطل"
          value={data.heroImage}
          onChange={(v) => updateField("heroImage", v)}
        />
        <ImageUploader
          label="صورة الخلفية"
          value={data.backgroundImage}
          onChange={(v) => updateField("backgroundImage", v)}
        />
      </div>
    </div>
  );
}
