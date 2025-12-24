import React from "react";
import { FaCheck } from "react-icons/fa";
import Img from "@/app/_components/_website/_global/Img";
import { FormValues } from "../schema";

interface CategoriesSectionProps {
  formData: FormValues;
  allCategories: any[];
  allSubCategories: any[];
  toggleCategory: (id: number) => void;
  toggleSubCategory: (id: number) => void;
  errors: Record<string, string>;
}

export default function CategoriesSection({
  formData,
  allCategories,
  allSubCategories,
  toggleCategory,
  toggleSubCategory,
  errors,
}: CategoriesSectionProps) {
  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 space-y-8">
      <div className="border-b border-gray-100 pb-4">
        <h2 className="text-xl font-bold text-gray-800">التصنيفات</h2>
        <p className="text-gray-500 text-sm mt-1">
          حدد الأقسام التي ينتمي إليها المركز
        </p>
      </div>

      {/* Main Categories */}
      <div className="space-y-4">
        <label className="text-sm font-semibold text-gray-700 block">
          الأقسام الرئيسية <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {allCategories?.map((cat: any) => {
            const isActive = formData.categories.includes(cat.id);
            return (
              <div
                key={cat.id}
                onClick={() => toggleCategory(cat.id)}
                className={`relative p-4 rounded-2xl border-2 cursor-pointer transition-all duration-200 flex flex-col items-center gap-3 group ${
                  isActive
                    ? "border-sky-500 bg-sky-50/50 shadow-sm"
                    : "border-gray-100 hover:border-sky-200 hover:bg-gray-50"
                }`}
              >
                {isActive && (
                  <div className="absolute top-3 right-3 w-6 h-6 bg-sky-500 text-white rounded-full flex items-center justify-center text-xs animate-in zoom-in duration-200">
                    <FaCheck />
                  </div>
                )}
                <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 p-0.5">
                  <Img
                    src={cat.image}
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
                <span
                  className={`text-sm font-medium text-center ${
                    isActive ? "text-sky-700" : "text-gray-600"
                  }`}
                >
                  {cat.title_ar}
                </span>
              </div>
            );
          })}
        </div>
        {errors.categories && (
          <p className="text-red-500 text-xs mt-1">{errors.categories}</p>
        )}
      </div>

      <div className="h-px bg-gray-100" />

      {/* Sub Categories */}
      <div className="space-y-4">
        <label className="text-sm font-semibold text-gray-700 block">
          الأقسام الفرعية
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 max-h-96 overflow-y-auto p-1 custom-scrollbar">
          {allSubCategories?.map((sub: any) => {
            const isActive =
              formData?.sub_categories &&
              formData?.sub_categories.includes(sub.id);
            return (
              <div
                key={sub.id}
                onClick={() => toggleSubCategory(sub.id)}
                className={`relative px-3 py-2 rounded-xl border cursor-pointer transition-all flex items-center gap-3 ${
                  isActive
                    ? "border-sky-500 bg-sky-50"
                    : "border-gray-200 hover:border-sky-300"
                }`}
              >
                <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-100 shrink-0 flex items-center justify-center">
                  <Img src={sub.image} className="w-full h-full object-cover" />
                </div>
                <span
                  className={`text-xs font-medium line-clamp-2 ${
                    isActive ? "text-sky-700" : "text-gray-600"
                  }`}
                >
                  {sub.title_ar}
                </span>
                {isActive && (
                  <FaCheck className="mr-auto text-sky-500 text-xs" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
