"use client";

import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  FaFilter,
  FaSearch,
  FaTimes,
  FaPlus,
  FaCalendarAlt,
  FaSortAmountDown,
  FaSortAmountUp,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
import { MdPriceChange } from "react-icons/md";

import { useAppDispatch, useAppSelector } from "@/app/Store/hooks";
import { setServicesFilterSidebar } from "@/app/Store/variablesSlice";
import { ServicePageFilters, DEFAULT_FILTERS, SortByOptions } from "./types";
import LocaleLink from "@/app/_components/_website/_global/LocaleLink";

interface ServicePageFilterSidebarProps {
  filters: ServicePageFilters;
  setFilters: Dispatch<SetStateAction<ServicePageFilters>>;
}

// Collapsible Section Component
function FilterSection({
  title,
  icon,
  children,
  defaultOpen = true,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-gray-100 pb-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full py-2 text-sm font-semibold text-gray-700 hover:text-gray-900 transition-colors"
      >
        <div className="flex items-center gap-2">
          {icon}
          <span>{title}</span>
        </div>
        {isOpen ? (
          <FaChevronUp className="w-3 h-3 text-gray-400" />
        ) : (
          <FaChevronDown className="w-3 h-3 text-gray-400" />
        )}
      </button>
      <motion.div
        initial={false}
        animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
        className="overflow-hidden"
      >
        <div className="pt-2">{children}</div>
      </motion.div>
    </div>
  );
}

export default function ServicePageFilterSidebar({
  filters,
  setFilters,
}: ServicePageFilterSidebarProps) {
  const dispatch = useAppDispatch();
  const { categories } = useAppSelector((state) => state.categories);
  const { servicesFilterSidebar, width } = useAppSelector(
    (state) => state.variables
  );

  const handleClose = () => {
    dispatch(setServicesFilterSidebar(false));
  };

  const handleFilterChange = (key: keyof ServicePageFilters, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleResetFilters = () => {
    setFilters(DEFAULT_FILTERS);
  };

  // Count active filters
  const activeFiltersCount = Object.entries(filters).filter(
    ([key, value]) =>
      value !== "" && value !== DEFAULT_FILTERS[key as keyof ServicePageFilters]
  ).length;

  // Auto-show sidebar on desktop
  useEffect(() => {
    if (width >= 1024) {
      dispatch(setServicesFilterSidebar(true));
    }
  }, [dispatch, width]);

  // Sort options
  const sortOptions: { value: SortByOptions; label: string }[] = [
    { value: "order", label: "الترتيب" },
    { value: "created_at", label: "تاريخ الإنشاء" },
    { value: "updated_at", label: "تاريخ التحديث" },
    { value: "price", label: "السعر" },
    { value: "slug", label: "الرابط" },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {servicesFilterSidebar && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={handleClose}
        />
      )}

      {/* Sidebar */}
      {servicesFilterSidebar && (
        <motion.aside
          initial={{ x: 300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 300, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="fixed right-0 top-0 h-screen w-80 bg-white shadow-2xl z-50 lg:relative lg:z-auto lg:shadow-none lg:border-l lg:border-gray-200"
        >
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="p-5 border-b border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <FaFilter className="text-blue-600 w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">الفلاتر</h2>
                    {activeFiltersCount > 0 && (
                      <span className="text-xs text-blue-600">
                        {activeFiltersCount} فلتر نشط
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleResetFilters}
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
                  >
                    مسح الكل
                  </button>
                  <button
                    onClick={handleClose}
                    className="lg:hidden p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all"
                  >
                    <FaTimes />
                  </button>
                </div>
              </div>

              {/* Add New Button */}
              <LocaleLink
                href="/dashboard/addservice"
                className="flex items-center justify-center gap-2 w-full py-3 bg-linear-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg shadow-blue-500/25"
              >
                <FaPlus className="w-4 h-4" />
                إضافة صفحة خدمة جديدة
              </LocaleLink>
            </div>

            {/* Filters Content */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {/* Search */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  البحث
                </label>
                <div className="relative">
                  <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    value={filters.search}
                    onChange={(e) =>
                      handleFilterChange("search", e.target.value)
                    }
                    placeholder="ابحث في العنوان..."
                    className="w-full pr-10 pl-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm"
                  />
                </div>
              </div>

              {/* Category Filter */}
              <FilterSection
                title="التصنيف"
                icon={<span className="text-blue-500">📁</span>}
              >
                <select
                  value={filters.category_id}
                  onChange={(e) =>
                    handleFilterChange("category_id", e.target.value)
                  }
                  className="w-full p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none appearance-none bg-white cursor-pointer transition-all text-sm"
                >
                  <option value="">جميع التصنيفات</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.title_ar}
                    </option>
                  ))}
                </select>
              </FilterSection>

              {/* Type Filter */}
              <FilterSection
                title="النوع"
                icon={<span className="text-green-500">🏷️</span>}
              >
                <div className="flex gap-2">
                  {[
                    { value: "", label: "الكل" },
                    { value: "service", label: "خدمة" },
                    { value: "product", label: "منتج" },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleFilterChange("type", option.value)}
                      className={`flex-1 p-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        filters.type === option.value
                          ? "bg-blue-600 text-white shadow-md"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </FilterSection>

              {/* Status Filter */}
              <FilterSection
                title="الحالة"
                icon={<span className="text-purple-500">📊</span>}
              >
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { value: "", label: "الكل" },
                    { value: "active", label: "نشط" },
                    { value: "inactive", label: "غير نشط" },
                    { value: "pending", label: "قيد المراجعة" },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleFilterChange("status", option.value)}
                      className={`p-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        filters.status === option.value
                          ? "bg-blue-600 text-white shadow-md"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </FilterSection>

              {/* Active State Filter */}
              <FilterSection
                title="حالة التفعيل"
                icon={<span className="text-orange-500">⚡</span>}
              >
                <div className="flex gap-2">
                  {[
                    { value: "", label: "الكل" },
                    { value: "true", label: "مفعّل" },
                    { value: "false", label: "غير مفعّل" },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() =>
                        handleFilterChange("is_active", option.value)
                      }
                      className={`flex-1 p-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        filters.is_active === option.value
                          ? "bg-blue-600 text-white shadow-md"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </FilterSection>

              {/* Price Range Filter */}
              <FilterSection
                title="نطاق السعر"
                icon={<MdPriceChange className="text-emerald-500 w-4 h-4" />}
                defaultOpen={false}
              >
                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <input
                      type="number"
                      value={filters.min_price}
                      onChange={(e) =>
                        handleFilterChange("min_price", e.target.value)
                      }
                      placeholder="من"
                      min="0"
                      className="w-full p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm text-center"
                    />
                  </div>
                  <span className="text-gray-400">-</span>
                  <div className="flex-1">
                    <input
                      type="number"
                      value={filters.max_price}
                      onChange={(e) =>
                        handleFilterChange("max_price", e.target.value)
                      }
                      placeholder="إلى"
                      min="0"
                      className="w-full p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm text-center"
                    />
                  </div>
                  <span className="text-xs text-gray-500">ر.ع</span>
                </div>
              </FilterSection>

              {/* Date Range Filter */}
              <FilterSection
                title="نطاق التاريخ"
                icon={<FaCalendarAlt className="text-pink-500 w-4 h-4" />}
                defaultOpen={false}
              >
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">
                      من تاريخ
                    </label>
                    <input
                      type="date"
                      value={filters.from_date}
                      onChange={(e) =>
                        handleFilterChange("from_date", e.target.value)
                      }
                      className="w-full p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">
                      إلى تاريخ
                    </label>
                    <input
                      type="date"
                      value={filters.to_date}
                      onChange={(e) =>
                        handleFilterChange("to_date", e.target.value)
                      }
                      className="w-full p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                    />
                  </div>
                </div>
              </FilterSection>

              {/* Sorting */}
              <FilterSection
                title="الترتيب"
                icon={
                  filters.sort_order === "asc" ? (
                    <FaSortAmountUp className="text-indigo-500 w-4 h-4" />
                  ) : (
                    <FaSortAmountDown className="text-indigo-500 w-4 h-4" />
                  )
                }
              >
                <div className="space-y-3">
                  {/* Sort By */}
                  <select
                    value={filters.sort_by}
                    onChange={(e) =>
                      handleFilterChange("sort_by", e.target.value)
                    }
                    className="w-full p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none appearance-none bg-white cursor-pointer transition-all text-sm"
                  >
                    {sortOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>

                  {/* Sort Order */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleFilterChange("sort_order", "asc")}
                      className={`flex-1 flex items-center justify-center gap-2 p-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        filters.sort_order === "asc"
                          ? "bg-blue-600 text-white shadow-md"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      <FaSortAmountUp className="w-3 h-3" />
                      تصاعدي
                    </button>
                    <button
                      onClick={() => handleFilterChange("sort_order", "desc")}
                      className={`flex-1 flex items-center justify-center gap-2 p-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        filters.sort_order === "desc"
                          ? "bg-blue-600 text-white shadow-md"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      <FaSortAmountDown className="w-3 h-3" />
                      تنازلي
                    </button>
                  </div>
                </div>
              </FilterSection>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-100 bg-gray-50">
              <p className="text-xs text-gray-500 text-center">
                تصفية وترتيب النتائج بناءً على معايير محددة
              </p>
            </div>
          </div>
        </motion.aside>
      )}
    </>
  );
}
