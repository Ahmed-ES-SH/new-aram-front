"use client";
import { CTASection } from "./types";
import EditableField from "./EditableField";
import { FiZap } from "react-icons/fi";

interface CTASectionEditorProps {
  data: CTASection;
  onChange: (data: CTASection) => void;
}

export default function CTASectionEditor({
  data,
  onChange,
}: CTASectionEditorProps) {
  const updateField = (field: keyof CTASection, value: string) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
        <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center">
          <FiZap className="text-orange-600" size={20} />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900">
            دعوة للإجراء (CTA)
          </h3>
          <p className="text-sm text-gray-500">تعديل قسم الدعوة للإجراء</p>
        </div>
      </div>

      {/* Preview Card */}
      <div className="p-6 bg-linear-to-r from-primary to-primary-red rounded-2xl text-white">
        <h4 className="text-2xl font-bold mb-2">
          {data.ctaTitle || "عنوان الدعوة للإجراء"}
        </h4>
        <p className="text-white/80 mb-4">
          {data.ctaSubtitle || "وصف الدعوة للإجراء"}
        </p>
        <div className="flex gap-3">
          <span className="px-4 py-2 bg-white text-primary rounded-full text-sm font-medium">
            {data.ctaButton1 || "الزر الأول"}
          </span>
          <span className="px-4 py-2 bg-white/20 text-white rounded-full text-sm font-medium border border-white/30">
            {data.ctaButton2 || "الزر الثاني"}
          </span>
        </div>
      </div>

      {/* Form Fields */}
      <div className="grid grid-cols-1 gap-4">
        <EditableField
          label="العنوان الرئيسي"
          value={data.ctaTitle}
          onChange={(v) => updateField("ctaTitle", v)}
          placeholder="مثال: ابدأ رحلتك الرقمية اليوم"
        />
        <EditableField
          label="العنوان الفرعي"
          value={data.ctaSubtitle}
          onChange={(v) => updateField("ctaSubtitle", v)}
          type="textarea"
          placeholder="مثال: انضم لآلاف العملاء الذين وثقوا بنا"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <EditableField
          label="نص الزر الأول"
          value={data.ctaButton1}
          onChange={(v) => updateField("ctaButton1", v)}
          placeholder="مثال: اطلب الآن"
        />
        <EditableField
          label="نص الزر الثاني"
          value={data.ctaButton2}
          onChange={(v) => updateField("ctaButton2", v)}
          placeholder="مثال: تواصل معنا"
        />
      </div>
    </div>
  );
}
