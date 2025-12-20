"use client";

import { useState } from "react";
import CategorySelect from "./CategorySelect";
import { ServicePageData } from "./types";
import EditVideoPopup from "../_editherovideosection/EditVideoPopup";
import { FaPen } from "react-icons/fa";
import { formatTitle } from "@/app/_helpers/helpers";

interface SettingsSectionProps {
  serviceData: ServicePageData;
  categories: any[];
  onChange: (value: any, field: string) => void;
  mode: "edit" | "create";
}

export default function SettingsSection({
  serviceData,
  categories,
  onChange,
  mode,
}: SettingsSectionProps) {
  const [video, setVideo] = useState<any>(serviceData?.video ?? null);
  const [isOpen, setIsOpen] = useState(false);

  // Generic field updater for text fields
  const updateField = (
    value: string | boolean | number | null,
    field: keyof ServicePageData
  ) => {
    onChange(value, field);
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-gray-100 pb-4">
        <h2 className="text-xl font-bold text-gray-900">الإعدادات الأساسية</h2>
        <p className="text-sm text-gray-500 mt-1">
          أدخل المعلومات الأساسية لصفحة الخدمة
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* video input */}
        <div className="md:col-span-2 my-2 w-full">
          <div className="w-full">
            <label className="block text-gray-600 font-medium mb-2">
              {serviceData.main_video instanceof File
                ? `اسم الملف الخاص بالفديو :`
                : " رابط الفيديو الحالى"}
            </label>{" "}
            <div className="flex flex-col gap-3 w-full">
              <input
                type="text"
                value={(video?.video_url as string) ?? ""}
                readOnly={true}
                className="p-2 bg-gray-100 w-full rounded-md"
              />
              <div
                onClick={() => setIsOpen(true)}
                className="w-7 h-7 self-end text-white cursor-pointer flex items-center justify-center bg-primary rounded-md shadow"
              >
                <FaPen />
              </div>
            </div>
          </div>
        </div>

        {/* whatsapp number */}
        <div className="w-full md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            رقم الواتساب
          </label>
          <input
            type="text"
            name="whatsapp_number"
            value={serviceData.whatsapp_number}
            onChange={(e) => updateField(e.target.value, "whatsapp_number")}
            placeholder="مثال: +20123456789"
            className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
          />
        </div>

        {/* Slug */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            رابط الصفحة (Slug) <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="slug"
            value={serviceData.slug}
            onChange={(e) =>
              updateField(
                e.target.value.toLowerCase().replace(/\s+/g, "-"),
                "slug"
              )
            }
            placeholder="مثال: nfc-cards"
            className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
            dir="ltr"
          />
          <p className="text-xs text-gray-400 mt-1">
            سيظهر في الرابط: /services/{serviceData.slug || "your-slug"}
          </p>
        </div>

        {/* Category */}
        <CategorySelect
          value={serviceData.category_id}
          onChange={(value) => updateField(value, "category_id")}
          options={categories}
          labelKey="title_ar"
        />

        {/* Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            النوع
          </label>
          <div className="flex gap-3">
            {[
              { value: "one_time", label: "مرة واحدة" },
              { value: "subscription", label: "اشتراك" },
            ].map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => updateField(option.value, "type")}
                className={`flex-1 p-3 rounded-xl font-medium transition-all ${
                  serviceData.type === option.value
                    ? "bg-primary text-white shadow-md"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* order */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            الترتيب
          </label>
          <div className="relative">
            <input
              type="number"
              value={serviceData.order}
              onChange={(e) => updateField(e.target.value, "order")}
              placeholder="0.00"
              min="0"
              step="0.01"
              className="w-full p-3 pl-12 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
              رقم
            </span>
          </div>
        </div>

        {/* Price */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            السعر
          </label>
          <div className="relative">
            <input
              type="number"
              value={serviceData.price}
              onChange={(e) => updateField(e.target.value, "price")}
              placeholder="0.00"
              min="0"
              step="0.01"
              className="w-full p-3 pl-12 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
              ر.ع
            </span>
          </div>
        </div>

        {/* Price Before Discount */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            السعر قبل الخصم
          </label>
          <div className="relative">
            <input
              type="number"
              value={serviceData.price_before_discount}
              onChange={(e) =>
                updateField(e.target.value, "price_before_discount")
              }
              placeholder="0.00"
              min="0"
              step="0.01"
              className="w-full p-3 pl-12 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
              ر.ع
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            اتركه فارغاً إذا لم يكن هناك خصم
          </p>
        </div>

        {/* Is Active */}
        {mode == "create" && (
          <div className="md:col-span-2">
            <label className="flex items-center gap-3 cursor-pointer">
              <div
                onClick={() =>
                  updateField("is_active", !serviceData.is_active as any)
                }
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  serviceData.is_active ? "bg-green-500" : "bg-gray-300"
                }`}
              >
                <div
                  className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${
                    serviceData.is_active ? "right-1" : "left-1"
                  }`}
                />
              </div>
              <span className="text-sm font-medium text-gray-700">
                تفعيل الصفحة فور الإنشاء
              </span>
            </label>
          </div>
        )}
      </div>

      <EditVideoPopup
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        setMainVideo={(video) => updateField(video, "main_video")}
        video_id={formatTitle(serviceData.slug)}
        title={`تعديل فيديو الخدمه ${serviceData.slug}`}
      />
    </div>
  );
}
