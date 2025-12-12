"use client";
import { SolutionSection, SolutionFeature, ICON_COLORS } from "./types";
import EditableField from "./EditableField";
import IconSelector from "./IconSelector";
import ImageUploader from "./ImageUploader";
import { FiCheckCircle, FiPlus, FiTrash2 } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

interface SolutionSectionEditorProps {
  data: SolutionSection;
  onChange: (data: SolutionSection) => void;
}

export default function SolutionSectionEditor({
  data,
  onChange,
}: SolutionSectionEditorProps) {
  const updateField = (field: keyof SolutionSection, value: string) => {
    onChange({ ...data, [field]: value });
  };

  const updateFeature = (
    index: number,
    field: keyof SolutionFeature,
    value: string
  ) => {
    const newFeatures = [...data.features];
    newFeatures[index] = { ...newFeatures[index], [field]: value };
    onChange({ ...data, features: newFeatures });
  };

  const addFeature = () => {
    const newFeature: SolutionFeature = {
      id: Date.now().toString(),
      icon: "check",
      color: "bg-blue-500",
      title: "",
      description: "",
    };
    onChange({ ...data, features: [...data.features, newFeature] });
  };

  const removeFeature = (index: number) => {
    const newFeatures = data.features.filter((_, i) => i !== index);
    onChange({ ...data, features: newFeatures });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
        <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
          <FiCheckCircle className="text-green-600" size={20} />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900">قسم الحل</h3>
          <p className="text-sm text-gray-500">تعديل الحلول والميزات</p>
        </div>
      </div>

      {/* Section Titles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <EditableField
          label="العنوان الرئيسي"
          value={data.title}
          onChange={(v) => updateField("title", v)}
          placeholder="مثال: الحل الذكي"
        />
        <EditableField
          label="العنوان الفرعي"
          value={data.subtitle}
          onChange={(v) => updateField("subtitle", v)}
          placeholder="مثال: بطاقات NFC الذكية توفر كل ما تحتاجه"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <EditableField
          label="نص الزر"
          value={data.cta}
          onChange={(v) => updateField("cta", v)}
          placeholder="مثال: اطلب الآن"
        />
        <ImageUploader
          label="صورة المعاينة"
          value={data.previewImage}
          onChange={(v) => updateField("previewImage", v)}
        />
      </div>

      {/* Features */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-medium text-gray-700">
            الميزات ({data.features.length})
          </h4>
          <button
            type="button"
            onClick={addFeature}
            className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            <FiPlus size={16} />
            إضافة ميزة
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <AnimatePresence>
            {data.features.map((feature, index) => (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="p-4 bg-white rounded-xl border border-gray-200"
              >
                <div className="flex items-start justify-between mb-4">
                  <span className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full">
                    ميزة {index + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeFeature(index)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <FiTrash2 size={16} />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <IconSelector
                      label="الأيقونة"
                      value={feature.icon}
                      onChange={(v) => updateFeature(index, "icon", v)}
                    />
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        اللون
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {ICON_COLORS.map((color) => (
                          <button
                            key={color}
                            type="button"
                            onClick={() => updateFeature(index, "color", color)}
                            className={`
                              w-8 h-8 rounded-lg ${color} transition-all
                              ${
                                feature.color === color
                                  ? "ring-2 ring-offset-2 ring-gray-400"
                                  : ""
                              }
                            `}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  <EditableField
                    label="العنوان"
                    value={feature.title}
                    onChange={(v) => updateFeature(index, "title", v)}
                    placeholder="عنوان الميزة..."
                  />

                  <EditableField
                    label="الوصف"
                    value={feature.description}
                    onChange={(v) => updateFeature(index, "description", v)}
                    type="textarea"
                    placeholder="وصف الميزة..."
                  />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {data.features.length === 0 && (
          <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
            <FiCheckCircle className="mx-auto text-gray-300" size={48} />
            <p className="mt-4 text-gray-500">لا توجد ميزات مضافة</p>
            <button
              type="button"
              onClick={addFeature}
              className="mt-4 text-green-500 hover:underline"
            >
              إضافة ميزة جديدة
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
