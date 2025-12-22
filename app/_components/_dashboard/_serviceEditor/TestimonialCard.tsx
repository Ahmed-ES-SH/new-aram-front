"use client";
import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { FiTrash2 } from "react-icons/fi";
import Img from "../../_website/_global/Img";
import { Testimonial } from "./types";
import EditableField from "./EditableField";
import RatingSelector from "./RatingSelector";

interface TestimonialCardProps {
  testimonial: Testimonial;
  data: Testimonial[];
  index: number;
  onChange: (data: Testimonial[], field: "testimonials") => void;
}

export default function TestimonialCard({
  testimonial,
  data,
  index,
  onChange,
}: TestimonialCardProps) {
  const fileInputRefs = useRef<{ [key: number]: HTMLInputElement | null }>({});
  const [isEditingOrder, setIsEditingOrder] = useState(false);

  const updateItem = (
    index: number,
    field: keyof Testimonial,
    value: string | number | File | null
  ) => {
    const newItems = [...data];
    newItems[index] = { ...newItems[index], [field]: value };
    onChange(newItems, "testimonials");
  };

  const removeItem = (index: number) => {
    const newItems = data.filter((_, i) => i !== index);
    onChange(newItems, "testimonials");
  };

  const handleFileChange = (index: number, file: File | null) => {
    if (file) {
      updateItem(index, "avatar", file);
    }
  };

  const avaterSrc = (testimonial: Testimonial) => {
    if (!testimonial.avatar) return "/defaults/male-noimage.jpg";

    // Check if avatar is a File object
    if ((testimonial.avatar as any) instanceof File) {
      return URL.createObjectURL(testimonial.avatar as any);
    }

    // Otherwise it's a string URL
    return testimonial.avatar;
  };
  return (
    <motion.div
      key={testimonial.id}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="p-6 bg-white rounded-xl border border-gray-200 shadow-sm"
    >
      <input
        type="file"
        accept="image/*"
        onChange={(e) => handleFileChange(index, e.target.files?.[0] || null)}
        ref={(el: any) => (fileInputRefs.current[testimonial.id] = el)}
        hidden
      />
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            onClick={() => fileInputRefs.current[testimonial.id]?.click()}
            className="w-16 h-16 rounded-full cursor-pointer hover:opacity-80 transition-opacity select-effect flex items-center justify-center overflow-hidden"
          >
            <Img
              src={avaterSrc(testimonial)}
              errorSrc="/defaults/male-noimage.jpg"
              alt={testimonial?.name_ar ?? ""}
              className="w-full h-full object-cover rounded-full"
            />
          </div>
          <div>
            <span className="text-sm font-medium text-gray-700">
              شهادة عميل
            </span>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-gray-400">رقم</span>
              {isEditingOrder ? (
                <input
                  type="number"
                  className="w-12 h-7 text-sm border border-yellow-400 rounded text-center focus:outline-none focus:ring-1 focus:ring-yellow-500"
                  value={testimonial.order || 0}
                  onChange={(e) =>
                    updateItem(index, "order", parseInt(e.target.value) || 0)
                  }
                  onBlur={() => setIsEditingOrder(false)}
                  autoFocus
                />
              ) : (
                <div
                  onClick={() => setIsEditingOrder(true)}
                  className="w-7 h-7 flex items-center justify-center bg-gray-100 rounded border border-gray-200 text-sm font-medium text-gray-600 cursor-pointer hover:bg-yellow-50 hover:border-yellow-200 hover:text-yellow-700 transition-all"
                  title="تعديل الترتيب"
                >
                  {testimonial.order || 0}
                </div>
              )}
            </div>
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
          label="اسم العميل (عربي)"
          value={testimonial.name_ar || ""}
          onChange={(v) => updateItem(index, "name_ar", v)}
          placeholder="اسم العميل بالعربي..."
        />
        <EditableField
          label="اسم العميل (إنجليزي)"
          value={testimonial.name_en || ""}
          onChange={(v) => updateItem(index, "name_en", v)}
          placeholder="Customer name in English..."
        />
      </div>

      <div className="mt-4">
        <RatingSelector
          rating={testimonial.rating || 5}
          onChange={(n) => updateItem(index, "rating", n)}
        />
      </div>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <EditableField
          label="نص الشهادة (عربي)"
          value={testimonial.text_ar || ""}
          onChange={(v) => updateItem(index, "text_ar", v)}
          type="textarea"
          placeholder="شهادة العميل بالعربي..."
        />
        <EditableField
          label="نص الشهادة (إنجليزي)"
          value={testimonial.text_en || ""}
          onChange={(v) => updateItem(index, "text_en", v)}
          type="textarea"
          placeholder="Customer testimonial in English..."
        />
      </div>
    </motion.div>
  );
}
