"use client";
import { CtaSection } from "./types";
import EditableField from "./EditableField";
import { FiZap } from "react-icons/fi";

interface CTASectionEditorProps {
  data: CtaSection;
  onChange: (data: CtaSection, field: string) => void;
}

export default function CTASectionEditor({
  data,
  onChange,
}: CTASectionEditorProps) {
  const updateField = (field: keyof CtaSection, value: string) => {
    onChange({ ...data, [field]: value }, "cta_section");
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
      <div className="p-6 min-h-[40vh] flex items-center justify-center bg-linear-to-r from-primary to-primary-red rounded-2xl text-white">
        <div className="flex flex-col gap-4">
          <h4 className="text-2xl font-bold mb-2">
            {data.cta_title_ar || "عنوان الدعوة للإجراء"}
          </h4>
          <p className="text-white/80 mb-4">
            {data.cta_subtitle_ar || "وصف الدعوة للإجراء"}
          </p>
        </div>
      </div>

      {/* Form Fields - Arabic */}
      <div className="space-y-4">
        <h4 className="font-medium text-gray-700">النصوص العربية</h4>
        <div className="grid grid-cols-1 gap-4">
          <EditableField
            label="العنوان الرئيسي (عربي)"
            value={data.cta_title_ar || ""}
            onChange={(v) => updateField("cta_title_ar", v)}
            placeholder="مثال: ابدأ رحلتك الرقمية اليوم"
          />
          <EditableField
            label="العنوان الفرعي (عربي)"
            value={data.cta_subtitle_ar || ""}
            onChange={(v) => updateField("cta_subtitle_ar", v)}
            type="textarea"
            placeholder="مثال: انضم لآلاف العملاء الذين وثقوا بنا"
          />
        </div>

        {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <EditableField
            label="نص الزر الأول (عربي)"
            value={data.cta_button1_ar || ""}
            onChange={(v) => updateField("cta_button1_ar", v)}
            placeholder="مثال: اطلب الآن"
          />
          <EditableField
            label="نص الزر الثاني (عربي)"
            value={data.cta_button2_ar || ""}
            onChange={(v) => updateField("cta_button2_ar", v)}
            placeholder="مثال: تواصل معنا"
          />
        </div> */}
      </div>

      {/* Form Fields - English */}
      <div className="space-y-4">
        <h4 className="font-medium text-gray-700">النصوص الإنجليزية</h4>
        <div className="grid grid-cols-1 gap-4">
          <EditableField
            label="العنوان الرئيسي (إنجليزي)"
            value={data.cta_title_en || ""}
            onChange={(v) => updateField("cta_title_en", v)}
            placeholder="Example: Start Your Digital Journey Today"
          />
          <EditableField
            label="العنوان الفرعي (إنجليزي)"
            value={data.cta_subtitle_en || ""}
            onChange={(v) => updateField("cta_subtitle_en", v)}
            type="textarea"
            placeholder="Example: Join thousands of customers who trust us"
          />
        </div>

        {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <EditableField
            label="نص الزر الأول (إنجليزي)"
            value={data.cta_button1_en || ""}
            onChange={(v) => updateField("cta_button1_en", v)}
            placeholder="Example: Order Now"
          />
          <EditableField
            label="نص الزر الثاني (إنجليزي)"
            value={data.cta_button2_en || ""}
            onChange={(v) => updateField("cta_button2_en", v)}
            placeholder="Example: Contact Us"
          />
        </div> */}
      </div>
    </div>
  );
}
