import React from "react";
import { FormValues } from "../schema";

interface BasicInfoSectionProps {
  formData: FormValues;
  errors: Record<string, string>;
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  isEmailReadOnly?: boolean;
  showPassword?: boolean;
}

export default function BasicInfoSection({
  formData,
  errors,
  handleChange,
  isEmailReadOnly = false,
  showPassword = false,
}: BasicInfoSectionProps) {
  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 space-y-8">
      <div className="border-b border-gray-100 pb-4">
        <h2 className="text-xl font-bold text-gray-800">المعلومات الأساسية</h2>
        <p className="text-gray-500 text-sm mt-1">
          البيانات التعريفية للمركز ومعلومات التواصل
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">
            اسم المركز <span className="text-red-500">*</span>
          </label>
          <input
            name="title"
            value={formData.title}
            onChange={handleChange}
            className={`w-full px-4 py-3 rounded-xl border bg-gray-50 focus:bg-white focus:ring-2 focus:ring-sky-100 transition-all outline-none ${
              errors.title
                ? "border-red-300"
                : "border-gray-200 focus:border-sky-400"
            }`}
            placeholder="أدخل اسم المركز"
          />
          {errors.title && (
            <p className="text-red-500 text-xs mt-1">{errors.title}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">
            البريد الإلكتروني <span className="text-red-500">*</span>
          </label>
          <div className="w-full relative">
            <input
              name="email"
              value={formData.email}
              onChange={handleChange}
              readOnly={isEmailReadOnly}
              className={`w-full px-4 py-3 rounded-xl border transition-all outline-none ${
                isEmailReadOnly
                  ? "bg-gray-100 text-gray-500 cursor-not-allowed border-gray-200"
                  : `bg-gray-50 focus:bg-white focus:ring-2 focus:ring-sky-100 ${
                      errors.email
                        ? "border-red-300"
                        : "border-gray-200 focus:border-sky-400"
                    }`
              }`}
              placeholder="example@domain.com"
            />

            {isEmailReadOnly && (
              <p className="bg-green-300 absolute top-1/2 -translate-y-1/2 left-2 text-white px-2 py-1 rounded-full text-xs mt-1">
                مفعل
              </p>
            )}
          </div>
          {!isEmailReadOnly && errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email}</p>
          )}
        </div>

        {showPassword && (
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">
              كلمة المرور <span className="text-red-500">*</span>
            </label>
            <input
              name="password"
              type="password"
              value={formData.password || ""}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-xl border bg-gray-50 focus:bg-white focus:ring-2 focus:ring-sky-100 transition-all outline-none ${
                errors.password
                  ? "border-red-300"
                  : "border-gray-200 focus:border-sky-400"
              }`}
              placeholder="********"
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password}</p>
            )}
          </div>
        )}

        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">
            رقم الهاتف <span className="text-red-500">*</span>
          </label>
          <input
            name="phone_number"
            value={formData.phone_number}
            onChange={handleChange}
            className={`w-full px-4 py-3 rounded-xl border bg-gray-50 focus:bg-white focus:ring-2 focus:ring-sky-100 transition-all outline-none text-left ${
              errors.phone_number
                ? "border-red-300"
                : "border-gray-200 focus:border-sky-400"
            }`}
            dir="ltr"
            placeholder="+968"
          />
          {errors.phone_number && (
            <p className="text-red-500 text-xs mt-1">{errors.phone_number}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">
            رابط الموقع (URL)
          </label>
          <input
            name="url"
            value={formData.url || ""}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-sky-100 focus:border-sky-400 transition-all outline-none text-left"
            dir="ltr"
            placeholder="https://example.com"
          />
        </div>

        <div className="space-y-2 col-span-full">
          <label className="text-sm font-semibold text-gray-700">
            الوصف <span className="text-red-500">*</span>
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className={`w-full px-4 py-3 rounded-xl border bg-gray-50 focus:bg-white focus:ring-2 focus:ring-sky-100 transition-all outline-none min-h-[120px] resize-y ${
              errors.description
                ? "border-red-300"
                : "border-gray-200 focus:border-sky-400"
            }`}
            placeholder="اكتب وصفاً مختصراً للمركز..."
          />
          {errors.description && (
            <p className="text-red-500 text-xs mt-1">{errors.description}</p>
          )}
        </div>
      </div>
    </div>
  );
}
