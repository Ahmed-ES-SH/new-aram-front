"use client";
import { TestimonialsSection, TestimonialItem } from "./types";
import EditableField from "./EditableField";
import ImageUploader from "./ImageUploader";
import { FiMessageSquare, FiPlus, FiTrash2, FiStar } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

interface TestimonialsSectionEditorProps {
  data: TestimonialsSection;
  onChange: (data: TestimonialsSection) => void;
}

export default function TestimonialsSectionEditor({
  data,
  onChange,
}: TestimonialsSectionEditorProps) {
  const updateTitle = (value: string) => {
    onChange({ ...data, title: value });
  };

  const updateItem = (
    index: number,
    field: keyof TestimonialItem,
    value: string | number
  ) => {
    const newItems = [...data.items];
    newItems[index] = { ...newItems[index], [field]: value };
    onChange({ ...data, items: newItems });
  };

  const addItem = () => {
    const newItem: TestimonialItem = {
      name: "",
      text: "",
      rating: 5,
      avatar: "",
    };
    onChange({ ...data, items: [...data.items, newItem] });
  };

  const removeItem = (index: number) => {
    const newItems = data.items.filter((_, i) => i !== index);
    onChange({ ...data, items: newItems });
  };

  const RatingSelector = ({
    rating,
    onChange,
  }: {
    rating: number;
    onChange: (n: number) => void;
  }) => (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700">التقييم</label>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            className="p-1 transition-transform hover:scale-110"
          >
            <FiStar
              size={24}
              className={
                star <= rating
                  ? "text-yellow-400 fill-yellow-400"
                  : "text-gray-300"
              }
            />
          </button>
        ))}
      </div>
    </div>
  );

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

      {/* Section Title */}
      <EditableField
        label="عنوان القسم"
        value={data.title}
        onChange={updateTitle}
        placeholder="مثال: ماذا يقول عملاؤنا؟"
      />

      {/* Testimonials List */}
      <div className="space-y-4">
        <AnimatePresence>
          {data.items.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="p-6 bg-white rounded-xl border border-gray-200 shadow-sm"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary-red flex items-center justify-center text-white font-bold">
                    {item.name ? item.name.charAt(0) : "?"}
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-700">
                      شهادة عميل
                    </span>
                    <p className="text-xs text-gray-400">رقم {index + 1}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeItem(index)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <FiTrash2 size={16} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <EditableField
                  label="اسم العميل"
                  value={item.name}
                  onChange={(v) => updateItem(index, "name", v)}
                  placeholder="اسم العميل..."
                />
                <RatingSelector
                  rating={item.rating}
                  onChange={(n) => updateItem(index, "rating", n)}
                />
              </div>

              <div className="mt-4">
                <EditableField
                  label="نص الشهادة"
                  value={item.text}
                  onChange={(v) => updateItem(index, "text", v)}
                  type="textarea"
                  placeholder="شهادة العميل..."
                />
              </div>

              <div className="mt-4">
                <ImageUploader
                  label="صورة العميل (اختياري)"
                  value={item.avatar}
                  onChange={(v) => updateItem(index, "avatar", v)}
                />
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {data.items.length === 0 && (
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
