"use client";
import { Organization } from "@/app/_components/_dashboard/_organizations/types/organization";
import { category } from "@/app/types/_dashboard/GlobalTypes";
import React, { useState, useEffect, Dispatch, SetStateAction } from "react";
import CategoriesSelector from "./CategoriesSelector";
import SubCategoriesSelector from "./SubCategoriesSelector";
import { useTranslations } from "next-intl";

interface props {
  formData: Partial<Organization>;
  setFormData: Dispatch<SetStateAction<Partial<Organization>>>;
  allCategories: category[];
  allSubCategories: category[];
}

export default function OrganizationSpecializations({
  formData,
  setFormData,
  allCategories,
  allSubCategories,
}: props) {
  const t = useTranslations("categoriesSelector");

  const [selectedCategories, setSelectedCategories] = useState<any>([]);
  const [selectedSubCategories, setSelectedSubCategories] = useState<any>([]);

  // Initialize from formData
  useEffect(() => {
    if (formData.categories) {
      setSelectedCategories(formData.categories);
    }
    if (formData.sub_categories) {
      setSelectedSubCategories(formData.sub_categories);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update formData whenever selections change
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      categories: selectedCategories,
      sub_categories: selectedSubCategories,
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategories, selectedSubCategories]);

  return (
    <div className="space-y-6 p-6 mt-4 bg-white rounded-lg border border-gray-200">
      <div>
        <CategoriesSelector
          selectedCategories={selectedCategories}
          setSelectedCategories={setSelectedCategories}
          setSelectedSubCategories={setSelectedSubCategories}
          selectedSubCategories={selectedSubCategories}
          allCategories={allCategories}
          t={t}
        />

        {/* SubCategories Section */}
        <SubCategoriesSelector
          selectedSubCategories={selectedSubCategories}
          setSelectedSubCategories={setSelectedSubCategories}
          allSubCategories={allSubCategories}
          t={t}
        />

        {/* Summary */}
        <div
          dir="rtl"
          className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200"
        >
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-700">{t("summary_title")}</span>
            <span className="font-semibold text-blue-700">
              {selectedCategories.length} {t("mainCategories")}{" "}
              {selectedSubCategories.length} {t("SubCategories")}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
