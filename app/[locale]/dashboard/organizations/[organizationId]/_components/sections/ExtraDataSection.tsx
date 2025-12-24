import React from "react";
import { FaPlus, FaTrash } from "react-icons/fa";
import KeywordSelector from "@/app/_components/_website/_global/KeywordSelector";
import { FormValues } from "../schema";

interface ExtraDataSectionProps {
  formData: FormValues;
  setFormData: React.Dispatch<React.SetStateAction<FormValues>>;
  handleBenefitChange: (index: number, value: string) => void;
  addBenefit: () => void;
  removeBenefit: (index: number) => void;
}

export default function ExtraDataSection({
  formData,
  setFormData,
  handleBenefitChange,
  addBenefit,
  removeBenefit,
}: ExtraDataSectionProps) {
  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 space-y-8">
      <div className="border-b border-gray-100 pb-4">
        <h2 className="text-xl font-bold text-gray-800">بيانات إضافية</h2>
        <p className="text-gray-500 text-sm mt-1">
          الكلمات المفتاحية والمميزات
        </p>
      </div>

      {/* Keywords */}
      <div className="space-y-4">
        <label className="text-sm font-semibold text-gray-700 block">
          الكلمات المفتاحية
        </label>
        <KeywordSelector
          selectedKeywords={formData.keywords}
          setSelectedKeywords={(keywords) =>
            setFormData({ ...formData, keywords })
          }
        />
      </div>

      <div className="h-px bg-gray-100" />

      {/* Benefits */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-sm font-semibold text-gray-700 block">
            المميزات الإضافية
          </label>
          <button
            type="button"
            onClick={addBenefit}
            className="flex items-center gap-2 px-3 py-1.5 text-sm bg-sky-50 text-sky-600 rounded-lg hover:bg-sky-100 transition-colors"
          >
            <FaPlus size={12} />
            <span>إضافة ميزة</span>
          </button>
        </div>

        <div className="space-y-3">
          {formData.benefits && formData.benefits.length === 0 && (
            <p className="text-sm text-gray-400 text-center py-4 bg-gray-50 rounded-xl border border-dashed border-gray-200">
              لا توجد مميزات مضافة
            </p>
          )}
          {formData.benefits &&
            formData.benefits.map((benefit, index) => (
              <div
                key={index}
                className="flex gap-3 group animate-in slide-in-from-top-2 duration-300"
              >
                <input
                  value={benefit.title}
                  onChange={(e) => handleBenefitChange(index, e.target.value)}
                  className="flex-1 px-4 py-2 rounded-xl border border-gray-200 bg-white focus:border-sky-400 focus:ring-2 focus:ring-sky-100 outline-none transition-all"
                  placeholder={`الميزة رقم ${index + 1}`}
                />
                <button
                  type="button"
                  onClick={() => removeBenefit(index)}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                >
                  <FaTrash />
                </button>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
