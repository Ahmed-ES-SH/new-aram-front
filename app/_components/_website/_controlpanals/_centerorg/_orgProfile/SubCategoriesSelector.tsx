import { getIconComponent } from "@/app/_helpers/helpers";
import { subCategory } from "@/app/types/_dashboard/GlobalTypes";
import React, { Dispatch, SetStateAction, useState } from "react";
import { FaPlus, FaTrash } from "react-icons/fa";

interface props {
  selectedSubCategories: subCategory[];
  setSelectedSubCategories: Dispatch<SetStateAction<subCategory[]>>;
  allSubCategories: subCategory[];
  t: any;
}

export default function SubCategoriesSelector({
  selectedSubCategories,
  setSelectedSubCategories,
  allSubCategories,
  t,
}: props) {
  const [showSubCategoryDropdown, setShowSubCategoryDropdown] = useState(false);
  const handleAddSubCategory = (subCategory) => {
    if (!selectedSubCategories.find((sc) => sc.id === subCategory.id)) {
      setSelectedSubCategories([...selectedSubCategories, subCategory]);
    }
    setShowSubCategoryDropdown(false);
  };

  const handleRemoveSubCategory = (subCategoryId) => {
    setSelectedSubCategories(
      selectedSubCategories.filter((sc) => sc.id !== subCategoryId)
    );
  };

  const getAvailableSubCategories = () => {
    return allSubCategories.filter(
      (subCat) => !selectedSubCategories.find((sc) => sc.id === subCat.id)
    );
  };
  return (
    <div className="w-full">
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-medium text-gray-700">
            {t("sub_label")}
          </label>
          <div className="relative">
            <button
              type="button"
              onClick={() =>
                setShowSubCategoryDropdown(!showSubCategoryDropdown)
              }
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
            >
              <FaPlus size={16} />
              {t("add_subcategory")}
            </button>

            {showSubCategoryDropdown &&
              getAvailableSubCategories().length > 0 && (
                <div className="absolute ltr:lg:right-1/2 ltr:-right-3 rtl:-left-3 rtl:lg:left-1/2 mt-2 w-96 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-64 overflow-y-auto">
                  {getAvailableSubCategories().map((subCategory) => {
                    const Icon = getIconComponent(subCategory.icon_name);
                    return (
                      <button
                        key={subCategory.id}
                        type="button"
                        onClick={() => handleAddSubCategory(subCategory)}
                        className="w-full text-right px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-primary">
                            <span className="text-white text-xs">
                              <Icon />
                            </span>
                          </div>
                          <div>
                            <div className="font-medium text-gray-800">
                              {subCategory.title_ar}
                            </div>
                            <div className="text-xs text-gray-500">
                              {subCategory.title_en}
                            </div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
          </div>
        </div>

        {/* All Selected SubCategories */}
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {selectedSubCategories.length === 0 ? (
            <div className="text-center py-8 text-gray-400 border-2 border-dashed border-gray-200 rounded-lg">
              {t("no_subcategories")}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {selectedSubCategories.map((subCat) => {
                const Icon = getIconComponent(subCat.icon_name);
                return (
                  <div
                    key={subCat.id}
                    className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                        <span className="text-white text-xs">{<Icon />}</span>
                      </div>
                      <div>
                        <div className="font-medium text-gray-800 text-sm">
                          {subCat.title_ar}
                        </div>
                        <div className="text-xs text-gray-500">
                          {subCat.title_en}
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveSubCategory(subCat.id)}
                      className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                    >
                      <FaTrash size={16} className="text-red-600" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
