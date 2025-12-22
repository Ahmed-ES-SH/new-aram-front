"use client";

import { GalleryImage, ServicePageData } from "./types";
import EditableField from "./EditableField";
import ImageUploader from "./ImageUploader";
import { FiImage, FiPlus, FiTrash2, FiGrid } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

interface GallerySectionEditorProps {
  servicePage: ServicePageData;
  data: GalleryImage[];
  onChange: (
    data: GalleryImage[],
    field: "gallery_images" | "deleted_images"
  ) => void;
}

export default function GallerySectionEditor({
  servicePage,
  data,
  onChange,
}: GallerySectionEditorProps) {
  const updateImage = (
    index: number,
    field: keyof GalleryImage,
    value: string | File | null
  ) => {
    const newImages = [...data];
    newImages[index] = {
      ...newImages[index],
      [field]: value,
    };
    onChange(newImages, "gallery_images");
  };

  const addImage = () => {
    const newImage: GalleryImage = {
      id: Date.now(),
      path: null,
      alt_ar: "",
      alt_en: "",
    };
    onChange([...data, newImage], "gallery_images");
  };

  const removeImage = (index: number) => {
    const newImages = data.filter((_, i) => i !== index);
    const deleted_images = servicePage.deleted_images
      ? [...servicePage.deleted_images, data[index]]
      : [data[index]];
    onChange(newImages, "gallery_images");
    onChange(deleted_images, "deleted_images");
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
            <p className="text-sm text-gray-500">إضافة الصور ورفعها كملفات</p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <h4 className="font-medium text-gray-700 flex items-center gap-2">
          <FiGrid size={16} />
          الصور ({data.length})
        </h4>
        <button
          type="button"
          onClick={addImage}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg"
        >
          <FiPlus size={16} />
          إضافة صورة
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence>
          {data.map((image, index) => (
            <motion.div
              key={image.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="p-4 bg-white rounded-xl border border-gray-200 space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-500">
                  صورة {index + 1}
                </span>
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                >
                  <FiTrash2 size={16} />
                </button>
              </div>

              {/* Image uploader (File OR existing URL) */}
              <ImageUploader
                label="الصورة"
                value={image.path}
                onChange={(file) => updateImage(index, "path", file)}
              />

              <EditableField
                label="النص التعريفي"
                value={image.alt_ar || ""}
                onChange={(v) => updateImage(index, "alt_ar", v)}
                placeholder="وصف الصورة..."
              />

              <EditableField
                label="النص التعريفي (en)"
                value={image.alt_en || ""}
                onChange={(v) => updateImage(index, "alt_en", v)}
                placeholder="Description..."
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Empty state */}
      {data.length === 0 && (
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
  );
}
