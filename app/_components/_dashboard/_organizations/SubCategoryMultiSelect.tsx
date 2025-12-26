"use client";

import { useState, useEffect } from "react";
import { FaCheck } from "react-icons/fa";
import Img from "../../_website/_global/Img";
import useFetchData from "@/app/_helpers/FetchDataWithAxios";

interface SubCategory {
  id: number;
  title_ar: string;
  icon_name: string;
  bg_color: string;
  image: string;
}

interface Props {
  currentSubCategories: SubCategory[];
  setUpdatedData: (cb: (prev: any) => any) => void;
  mode: "add" | "update";
}

export default function SubCategoryMultiSelect({
  currentSubCategories,
  setUpdatedData,
  mode,
}: Props) {
  const { data: subCategories } = useFetchData<SubCategory[]>(
    `/sub-categories`,
    false
  );
  // الحالة المحلية للأقسام المحددة
  const [selected, setSelected] = useState<number[]>([]);

  useEffect(() => {
    // Update only if selected changes
    setUpdatedData((prev: any) => {
      // Avoid unnecessary state updates
      if (JSON.stringify(prev.sub_categories) !== JSON.stringify(selected)) {
        return { ...prev, sub_categories: selected };
      }
      return prev;
    });
  }, [selected, setUpdatedData]);

  // دالة للتبديل بين التحديد والإلغاء
  const toggleCategory = (id: number) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  useEffect(() => {
    if (mode == "update") {
      if (currentSubCategories && Array.isArray(currentSubCategories)) {
        const validIds = currentSubCategories
          .filter((item: any) => item && item.id !== undefined)
          .map((item: any) => item.id);
        setSelected(validIds);
      }
    }
  }, [currentSubCategories, mode]);

  return (
    <div className="w-full flex flex-col gap-3">
      <label className="input-label">الأقسام الفرعية</label>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {subCategories &&
          subCategories
            .filter((cat) => cat && cat.id !== undefined)
            .map((cat) => {
              const isActive = selected.includes(cat.id);
              return (
                <div
                  key={cat.id}
                  onClick={() => toggleCategory(cat.id)}
                  className={`relative p-4 rounded-xl cursor-pointer border-2 transition 
          ${
            isActive
              ? "border-sky-500 bg-sky-100"
              : "border-gray-200 hover:border-sky-300"
          }`}
                >
                  <Img
                    src={cat.image}
                    alt={cat.title_ar}
                    className="w-8 h-8 rounded-full absolute top-2 left-4"
                  />
                  <h3 className="mt-2 text-center font-medium">
                    {cat.title_ar}
                  </h3>

                  {isActive && (
                    <span className="absolute top-2 right-2 bg-sky-500 text-white rounded-full p-1">
                      <FaCheck className="text-sm" />
                    </span>
                  )}
                </div>
              );
            })}
      </div>
    </div>
  );
}
