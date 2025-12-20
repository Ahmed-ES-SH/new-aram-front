"use client";
import { Testimonial } from "./types";
import { FiMessageSquare, FiPlus } from "react-icons/fi";
import { AnimatePresence } from "framer-motion";
import TestimonialCard from "./TestimonialCard";

interface TestimonialsSectionEditorProps {
  data: Testimonial[];
  onChange: (data: Testimonial[], field: string) => void;
}

export default function TestimonialsSectionEditor({
  data,
  onChange,
}: TestimonialsSectionEditorProps) {
  const addItem = () => {
    const newItem: Testimonial = {
      id: Date.now(),
      name_ar: "",
      name_en: "",
      text_ar: "",
      text_en: "",
      rating: 5,
      avatar: "",
      order: data.length + 1,
    };
    onChange([...data, newItem], "testimonials");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-yellow-100 flex items-center justify-center">
            <FiMessageSquare className="text-yellow-600" size={20} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">آراء العملاء</h3>
            <p className="text-sm text-gray-500">تعديل شهادات العملاء</p>
          </div>
        </div>
        <button
          type="button"
          onClick={addItem}
          className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
        >
          <FiPlus size={16} />
          إضافة رأي
        </button>
      </div>

      {/* Testimonials List */}
      <div className="space-y-4">
        <AnimatePresence>
          {data.map((item, index) => {
            if (!item) return null;
            return (
              <TestimonialCard
                key={`${item.id}-${index}`}
                testimonial={item}
                index={index}
                onChange={onChange}
                data={data}
              />
            );
          })}
        </AnimatePresence>
      </div>

      {data.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
          <FiMessageSquare className="mx-auto text-gray-300" size={48} />
          <p className="mt-4 text-gray-500">لا توجد شهادات عملاء</p>
          <button
            type="button"
            onClick={addItem}
            className="mt-4 text-yellow-500 hover:underline"
          >
            إضافة شهادة جديدة
          </button>
        </div>
      )}
    </div>
  );
}
