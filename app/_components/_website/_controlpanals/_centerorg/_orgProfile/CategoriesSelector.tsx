"use client";
import { getIconComponent } from "@/app/_helpers/helpers";
import { category } from "@/app/types/_dashboard/GlobalTypes";
import React, { Dispatch, SetStateAction, useState } from "react";
import { BiChevronDown, BiChevronUp } from "react-icons/bi";
import { FaPlus, FaTrash } from "react-icons/fa";

interface props {
  selectedCategories: category[];
  setSelectedCategories: Dispatch<SetStateAction<category[]>>;
  setSelectedSubCategories: Dispatch<SetStateAction<category[]>>;
  selectedSubCategories: category[];
  allCategories: category[];
  t: any;
}

export default function CategoriesSelector({
  selectedCategories,
  setSelectedCategories,
  setSelectedSubCategories,
  selectedSubCategories,
  allCategories,
  t,
}: props) {
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState<number | null>(null);

  const handleAddCategory = (category) => {
    if (!selectedCategories.find((c) => c.id === category.id)) {
      setSelectedCategories([...selectedCategories, category]);
    }
    setShowCategoryDropdown(false);
  };

  const handleRemoveCategory = (categoryId) => {
    setSelectedCategories(
      selectedCategories.filter((c) => c.id !== categoryId)
    );
    // Remove related subcategories
    setSelectedSubCategories(
      selectedSubCategories.filter((sc) => sc.parent_id !== categoryId)
    );
  };
  const getAvailableCategories = () => {
    return allCategories.filter(
      (cat) => !selectedCategories.find((sc) => sc.id === cat.id)
    );
  };
  const getSubCategoriesForCategory = (categoryId) => {
    return selectedSubCategories.filter((sc) => sc.parent_id === categoryId);
  };

  const handleRemoveSubCategory = (subCategoryId) => {
    setSelectedSubCategories(
      selectedSubCategories.filter((sc) => sc.id !== subCategoryId)
    );
  };

  return (
    <div>
      {/* Categories Section */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-medium text-gray-700">
            {t("main_label")}
          </label>
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              <FaPlus size={16} />
              {t("add_category")}
            </button>

            {showCategoryDropdown && getAvailableCategories().length > 0 && (
              <div className="absolute ltr:lg:right-1/2 ltr:-right-3 rtl:-left-3 rtl:lg:left-1/2 mt-2 w-96 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-80 overflow-y-auto">
                {getAvailableCategories().map((category) => {
                  const Icon = getIconComponent(category.icon_name);
                  return (
                    <button
                      key={category.id}
                      type="button"
                      onClick={() => handleAddCategory(category)}
                      className="w-full text-right px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                          <span className="text-white text-xs">
                            <Icon className="" />
                          </span>
                        </div>
                        <div>
                          <div className="font-medium text-gray-800">
                            {category.title_ar}
                          </div>
                          <div className="text-xs text-gray-500">
                            {category.title_en}
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

        {/* Selected Categories */}
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {selectedCategories.length === 0 ? (
            <div className="text-center py-8 text-gray-400 border-2 border-dashed border-gray-200 rounded-lg">
              {t("no_categories")}
            </div>
          ) : (
            selectedCategories.map((category) => {
              const subCats = getSubCategoriesForCategory(category.id);
              const isExpanded = expandedCategory === category.id;
              const Icon = getIconComponent(category.icon_name);

              return (
                <div
                  key={category.id}
                  className="border border-gray-200 rounded-lg overflow-hidden"
                >
                  <div className="flex items-center justify-between p-4 bg-gray-50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-primary">
                        <span className="text-white text-xs">
                          <Icon className="size-6" />
                        </span>
                      </div>
                      <div>
                        <div className="font-medium text-gray-800">
                          {category.title_ar}
                        </div>
                        <div className="text-xs text-gray-500">
                          {category.title_en}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {subCats.length > 0 && (
                        <button
                          type="button"
                          onClick={() =>
                            setExpandedCategory(isExpanded ? null : category.id)
                          }
                          className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                        >
                          {isExpanded ? (
                            <BiChevronUp size={16} className="text-gray-600" />
                          ) : (
                            <BiChevronDown
                              size={16}
                              className="text-gray-600"
                            />
                          )}
                        </button>
                      )}
                      <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded">
                        {subCats.length} {t("SubCategories")}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveCategory(category.id)}
                        className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                      >
                        <FaTrash size={16} className="text-red-600" />
                      </button>
                    </div>
                  </div>

                  {/* Subcategories for this category */}
                  {isExpanded && subCats.length > 0 && (
                    <div className="p-4 bg-white border-t border-gray-200">
                      <div className="space-y-2">
                        {subCats.map((subCat) => {
                          const Icon = getIconComponent(subCat.icon_name);
                          return (
                            <div
                              key={subCat.id}
                              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                            >
                              <div className="flex items-center gap-3">
                                <div
                                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                                  style={{ backgroundColor: subCat.bg_color }}
                                >
                                  <span className="text-white text-xs">
                                    <Icon />
                                  </span>
                                </div>
                                <div>
                                  <div className="text-sm font-medium text-gray-800">
                                    {subCat.title_ar}
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    {subCat.title_en}
                                  </div>
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={() =>
                                  handleRemoveSubCategory(subCat.id)
                                }
                                className="p-1.5 hover:bg-red-100 rounded-lg transition-colors"
                              >
                                <FaTrash size={14} className="text-red-600" />
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
