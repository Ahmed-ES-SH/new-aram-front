import React from "react";
import { FormValues } from "../schema";

interface SettingsSectionProps {
  formData: FormValues;
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
}

export default function SettingsSection({
  formData,
  handleChange,
}: SettingsSectionProps) {
  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 space-y-6">
      <div className="border-b border-gray-100 pb-4">
        <h2 className="text-xl font-bold text-gray-800">الإعدادات والحالة</h2>
        <p className="text-gray-500 text-sm mt-1">
          ضبط حالة الظهور وإعدادات الحجز
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">
            حالة المركز
          </label>
          <div className="relative">
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:border-sky-400 focus:ring-2 focus:ring-sky-100 outline-none appearance-none"
            >
              <option value="published">عام (منشور)</option>
              <option value="not_published">مخفي (غير منشور)</option>
              <option value="under_review">قيد المراجعة</option>
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">
            الظهور في الرئيسية
          </label>
          <select
            name="active"
            value={formData.active}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:border-sky-400 focus:ring-2 focus:ring-sky-100 outline-none appearance-none"
          >
            <option value={1}>مسموح</option>
            <option value={0}>ممنوع</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">
            حالة الحجز
          </label>
          <select
            name="booking_status"
            value={formData.booking_status}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:border-sky-400 focus:ring-2 focus:ring-sky-100 outline-none appearance-none"
          >
            <option value={1}>متاح الحجز</option>
            <option value={0}>الحجز مغلق</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">
            طلب تأكيد الحجز
          </label>
          <select
            name="confirmation_status"
            value={formData.confirmation_status}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:border-sky-400 focus:ring-2 focus:ring-sky-100 outline-none appearance-none"
          >
            <option value={1}>مفعل</option>
            <option value={0}>غير مفعل</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">
            سعر تأكيد الحجز
          </label>
          <input
            type="number"
            name="confirmation_price"
            value={formData.confirmation_price}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-sky-400 focus:ring-2 focus:ring-sky-100 outline-none"
            min="0"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">
              وقت البدء
            </label>
            <input
              type="time"
              name="open_at"
              value={formData.open_at}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-sky-400 focus:ring-2 focus:ring-sky-100 outline-none"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">
              وقت الإغلاق
            </label>
            <input
              type="time"
              name="close_at"
              value={formData.close_at}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-sky-400 focus:ring-2 focus:ring-sky-100 outline-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
