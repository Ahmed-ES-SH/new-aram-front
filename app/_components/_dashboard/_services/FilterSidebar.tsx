"use client";
import { useAppDispatch, useAppSelector } from "@/app/Store/hooks";
import { motion } from "framer-motion";
import { FaFilter, FaSearch, FaTimes } from "react-icons/fa";
import { setServicesFilterSidebar } from "@/app/Store/variablesSlice";
import { useEffect } from "react";

import RenderStars from "../../_website/_global/RenderStars";
import ClientSearchBox from "./ClientSearchBox";

type FilterSidebarProps = {
  filters: any;
  setFilters: React.Dispatch<React.SetStateAction<any>>;
};

export default function SidebarFilters({
  filters,
  setFilters,
}: FilterSidebarProps) {
  const { categories } = useAppSelector((state) => state.categories);
  const { servicesFilterSidebar, width } = useAppSelector(
    (state) => state.variables
  );

  const dispatch = useAppDispatch();

  const onClose = () => {
    dispatch(setServicesFilterSidebar(!servicesFilterSidebar));
  };

  const handleFilterChange = (key: keyof typeof filters, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const resetFilters = () => {
    setFilters({
      category: "",
      status: "",
      rating: "",
      minOrders: "",
      maxOrders: "",
      isExclusive: "",
      benefitType: "",
      dateFrom: "",
      dateTo: "",
      query: "",
    });
  };

  useEffect(() => {
    if (width >= 1024) {
      dispatch(setServicesFilterSidebar(true));
    }
  }, [dispatch, width]);

  return (
    <>
      {/* Mobile Overlay */}
      {servicesFilterSidebar && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-md bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      {servicesFilterSidebar && (
        <motion.div
          initial={{ x: -300 }}
          animate={{ x: servicesFilterSidebar ? 0 : -300 }}
          className="fixed right-0 top-0 min-h-screen w-80 bg-white shadow-xl max-lg:z-[99999]  lg:relative lg:translate-x-0 lg:shadow-none lg:border-l lg:border-gray-200"
        >
          <div className="p-6 h-full overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <FaFilter className="text-gray-600" />
                <h2 className="text-lg font-semibold text-gray-900">الفلاتر</h2>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={resetFilters}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  مسح الكل
                </button>
                <button
                  onClick={onClose}
                  className="lg:hidden p-1 text-gray-400 hover:text-gray-600"
                >
                  <FaTimes />
                </button>
              </div>
            </div>

            <div className="mb-6">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <ClientSearchBox filters={filters} setFilters={setFilters} />
              </div>
            </div>

            {/* Category Filter */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                التصنيف
              </label>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange("category", e.target.value)}
                className="w-full p-2 border outline-none border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">جميع التصنيفات</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.title_ar}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                الحالة
              </label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange("status", e.target.value)}
                className="w-full p-2 border outline-none border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">جميع الحالات</option>
                <option value="approved">مفعّل</option>
                <option value="pending">قيد المراجعة</option>
                <option value="rejected">مرفوض</option>
                <option value="suspended">معلق</option>
              </select>
            </div>

            {/* Rating Filter */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                التقييم
              </label>
              <div className="space-y-2">
                {[5, 4, 3, 2, 1].map((star) => {
                  const starValue = String(star);
                  return (
                    <label
                      key={star}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="rating"
                        value={starValue}
                        checked={filters.rating === starValue}
                        onChange={() => handleFilterChange("rating", starValue)}
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      <RenderStars rating={star} />
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Exclusive Filter */}
            {/* <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                حصري
              </label>
              <select
                value={filters.isExclusive}
                onChange={(e) =>
                  handleFilterChange("isExclusive", e.target.value)
                }
                className="w-full p-2 border outline-none border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">الكل</option>
                <option value="1">نعم</option>
                <option value="0">لا</option>
              </select>
            </div> */}

            {/* Benefit Type Filter */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                نوع الخصم
              </label>
              <select
                value={filters.benefitType}
                onChange={(e) =>
                  handleFilterChange("benefitType", e.target.value)
                }
                className="w-full p-2 border outline-none border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">جميع الأنواع</option>
                <option value="percentage">نسبة مئوية</option>
                <option value="fixed">مبلغ ثابت</option>
                <option value="none">بدون خصم</option>
              </select>
            </div>

            {/* Date Filter */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                تاريخ الإضافة
              </label>
              <div className="space-y-2">
                <input
                  type="date"
                  value={filters.dateFrom}
                  onChange={(e) =>
                    handleFilterChange("dateFrom", e.target.value)
                  }
                  className="w-full p-2 border outline-none border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <input
                  type="date"
                  value={filters.dateTo}
                  onChange={(e) => handleFilterChange("dateTo", e.target.value)}
                  className="w-full p-2 border outline-none border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </>
  );
}
