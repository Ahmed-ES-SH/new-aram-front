"use client";
import { ProblemSection, ProblemItem } from "./types";
import EditableField from "./EditableField";
import IconSelector from "./IconSelector";
import { FiAlertCircle, FiPlus, FiTrash2 } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

interface ProblemSectionEditorProps {
  data: ProblemSection;
  onChange: (data: ProblemSection) => void;
}

export default function ProblemSectionEditor({
  data,
  onChange,
}: ProblemSectionEditorProps) {
  const updateField = (field: keyof ProblemSection, value: string) => {
    onChange({ ...data, [field]: value });
  };

  const updateItem = (
    index: number,
    field: keyof ProblemItem,
    value: string
  ) => {
    const newItems = [...data.items];
    newItems[index] = { ...newItems[index], [field]: value };
    onChange({ ...data, items: newItems });
  };

  const addItem = () => {
    const newItem: ProblemItem = {
      icon: "star",
      title: "",
      description: "",
    };
    onChange({ ...data, items: [...data.items, newItem] });
  };

  const removeItem = (index: number) => {
    const newItems = data.items.filter((_, i) => i !== index);
    onChange({ ...data, items: newItems });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
        <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
          <FiAlertCircle className="text-red-600" size={20} />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900">قسم المشكلة</h3>
          <p className="text-sm text-gray-500">
            تعديل المشاكل التي تواجه العملاء
          </p>
        </div>
      </div>

      {/* Section Titles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <EditableField
          label="العنوان الرئيسي"
          value={data.title}
          onChange={(v) => updateField("title", v)}
          placeholder="مثال: المشكلة التي نحلها"
        />
        <EditableField
          label="العنوان الفرعي"
          value={data.subtitle}
          onChange={(v) => updateField("subtitle", v)}
          placeholder="مثال: البطاقات الورقية لها عيوب كثيرة"
        />
      </div>

      {/* Problem Items */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-medium text-gray-700">
            المشاكل ({data.items.length})
          </h4>
          <button
            type="button"
            onClick={addItem}
            className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            <FiPlus size={16} />
            إضافة مشكلة
          </button>
        </div>

        <div className="space-y-4">
          <AnimatePresence>
            {data.items.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="p-4 bg-white rounded-xl border border-gray-200"
              >
                <div className="flex items-start justify-between mb-4">
                  <span className="px-3 py-1 bg-red-100 text-red-700 text-sm rounded-full">
                    مشكلة {index + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <FiTrash2 size={16} />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <IconSelector
                    label="الأيقونة"
                    value={item.icon}
                    onChange={(v) => updateItem(index, "icon", v)}
                  />
                  <div className="md:col-span-2">
                    <EditableField
                      label="العنوان"
                      value={item.title}
                      onChange={(v) => updateItem(index, "title", v)}
                      placeholder="عنوان المشكلة..."
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <EditableField
                    label="الوصف"
                    value={item.description}
                    onChange={(v) => updateItem(index, "description", v)}
                    type="textarea"
                    placeholder="وصف تفصيلي للمشكلة..."
                  />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {data.items.length === 0 && (
          <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
            <FiAlertCircle className="mx-auto text-gray-300" size={48} />
            <p className="mt-4 text-gray-500">لا توجد مشاكل مضافة</p>
            <button
              type="button"
              onClick={addItem}
              className="mt-4 text-red-500 hover:underline"
            >
              إضافة مشكلة جديدة
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
