"use client";
import { useState } from "react";
import { GallerySection, GalleryImage } from "./types";
import EditableField from "./EditableField";
import ImageUploader from "./ImageUploader";
import { FiImage, FiPlus, FiTrash2, FiGrid } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

interface GallerySectionEditorProps {
  data: GallerySection;
  onChange: (data: GallerySection) => void;
}

export default function GallerySectionEditor({
  data,
  onChange,
}: GallerySectionEditorProps) {
  const [showTranslations, setShowTranslations] = useState(false);

  const updateTranslation = (
    field: keyof GallerySection["translations"],
    value: string
  ) => {
    onChange({
      ...data,
      translations: { ...data.translations, [field]: value },
    });
  };

  const updateImage = (
    index: number,
    field: keyof GalleryImage,
    value: string
  ) => {
    const newImages = [...data.images];
    newImages[index] = { ...newImages[index], [field]: value };
    onChange({ ...data, images: newImages });
  };

  const addImage = () => {
    const newImage: GalleryImage = {
      id: Date.now().toString(),
      src: "",
      alt: "",
    };
    onChange({ ...data, images: [...data.images, newImage] });
  };

  const removeImage = (index: number) => {
    const newImages = data.images.filter((_, i) => i !== index);
    onChange({ ...data, images: newImages });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
            <FiImage className="text-green-600" size={20} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">معرض الصور</h3>
            <p className="text-sm text-gray-500">إدارة صور المعرض والنصوص</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setShowTranslations(!showTranslations)}
          className="px-4 py-2 text-sm rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
        >
          {showTranslations ? "إخفاء الترجمات" : "تعديل الترجمات"}
        </button>
      </div>

      {/* Translations Section */}
      <AnimatePresence>
        {showTranslations && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="p-4 bg-gray-50 rounded-xl space-y-4">
              <h4 className="font-medium text-gray-700">ترجمات المعرض</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <EditableField
                  label="عنوان المعرض"
                  value={data.translations.galleryTitle}
                  onChange={(v) => updateTranslation("galleryTitle", v)}
                />
                <EditableField
                  label="عرض التفاصيل"
                  value={data.translations.viewDetails}
                  onChange={(v) => updateTranslation("viewDetails", v)}
                />
                <EditableField
                  label="إغلاق"
                  value={data.translations.close}
                  onChange={(v) => updateTranslation("close", v)}
                />
                <EditableField
                  label="التالي"
                  value={data.translations.next}
                  onChange={(v) => updateTranslation("next", v)}
                />
                <EditableField
                  label="السابق"
                  value={data.translations.prev}
                  onChange={(v) => updateTranslation("prev", v)}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Images Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-medium text-gray-700 flex items-center gap-2">
            <FiGrid size={16} />
            الصور ({data.images.length})
          </h4>
          <button
            type="button"
            onClick={addImage}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            <FiPlus size={16} />
            إضافة صورة
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {data.images.map((image, index) => (
              <motion.div
                key={image.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="p-4 bg-white rounded-xl border border-gray-200 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-500">
                    صورة {index + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <FiTrash2 size={16} />
                  </button>
                </div>
                <ImageUploader
                  label="الصورة"
                  value={image.src}
                  onChange={(v) => updateImage(index, "src", v)}
                />
                <EditableField
                  label="النص البديل"
                  value={image.alt}
                  onChange={(v) => updateImage(index, "alt", v)}
                  placeholder="وصف الصورة..."
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {data.images.length === 0 && (
          <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
            <FiImage className="mx-auto text-gray-300" size={48} />
            <p className="mt-4 text-gray-500">لا توجد صور في المعرض</p>
            <button
              type="button"
              onClick={addImage}
              className="mt-4 text-primary hover:underline"
            >
              إضافة صورة جديدة
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
