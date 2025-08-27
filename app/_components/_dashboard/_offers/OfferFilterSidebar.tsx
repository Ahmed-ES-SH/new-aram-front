"use client";

import type React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiChevronDown, FiFilter, FiSearch } from "react-icons/fi";
import { useAppDispatch, useAppSelector } from "@/app/Store/hooks";
import { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import { setOffersFilterSidebar } from "@/app/Store/variablesSlice";

interface OfferFilters {
  query: string;
  status: string;
  category_id: string;
  discount_type: string;
  start_date: string;
  end_date: string;
}

interface FilterSidebarProps {
  filters: OfferFilters;
  setFilters: (filters: OfferFilters) => void;
}

interface CollapsibleSectionProps {
  title: string;
  children: React.ReactNode;
}

const CollapsibleSection = ({ title, children }: CollapsibleSectionProps) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="border-b border-gray-300 pb-4 mb-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full text-left font-medium text-foreground hover:text-sky-300 transition-colors"
      >
        <span>{title}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <FiChevronDown className="w-4 h-4" />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="pt-3 space-y-3">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function OfferFilterSidebar({
  filters,
  setFilters,
}: FilterSidebarProps) {
  const { categories } = useAppSelector((state) => state.categories);
  const { offerFilterSidebar, width } = useAppSelector(
    (state) => state.variables
  );
  const dispatch = useAppDispatch();

  const updateFilter = (key: keyof OfferFilters, value: string) => {
    setFilters({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    setFilters({
      query: "",
      status: "",
      category_id: "",
      discount_type: "",
      start_date: "",
      end_date: "",
    });
  };

  const closeSidebar = () => {
    dispatch(setOffersFilterSidebar(false));
  };

  useEffect(() => {
    if (width >= 1024) {
      dispatch(setOffersFilterSidebar(true));
    }
  }, [dispatch, width]);

  return (
    <>
      {/* Overlay للموبايل */}
      {offerFilterSidebar && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-md z-40 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      {offerFilterSidebar && (
        <motion.div
          dir="rtl"
          initial={{ x: -300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="fixed right-0 top-0 min-h-screen min-w-80 bg-white shadow-xl max-lg:z-[99999] lg:relative lg:translate-x-0 lg:shadow-none lg:border-l lg:border-gray-200 overflow-y-auto p-3"
        >
          <button
            onClick={closeSidebar}
            className="lg:hidden p-1 block w-fit ml-auto mb-4 text-red-400 hover:text-red-600 duration-150"
          >
            <FaTimes />
          </button>
          <div className="flex items-center justify-between gap-2 mb-6">
            <div className="flex items-center gap-2">
              <FiFilter className="w-5 h-5 text-sky-300" />
              <h2 className="text-xl font-semibold text-foreground">
                فلاتر العروض
              </h2>
            </div>
            <button
              onClick={clearFilters}
              className="px-2 py-2 text-red-400 hover:underline duration-150 rounded-lg flex items-center justify-center"
            >
              <p className="text-[14px]">إلغاء الفلاتر</p>
            </button>
          </div>

          {/* Search Query */}
          <CollapsibleSection title="بحث">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <input
                type="text"
                placeholder="ابحث عن العروض هنا ..."
                value={filters.query}
                onChange={(e) => updateFilter("query", e.target.value)}
                className="w-full pl-10 pr-4 py-2 border-gray-300 border outline-none rounded-lg bg-background text-foreground placeholder:text-muted-foreground  focus:border-sky-400"
              />
            </div>
          </CollapsibleSection>

          {/* Status Filter */}
          <CollapsibleSection title="الحالة">
            <select
              value={filters.status}
              onChange={(e) => updateFilter("status", e.target.value)}
              className="w-full px-3 py-2 border-gray-300 border rounded-lg bg-background text-foreground focus:border-sky-400 outline-none"
            >
              <option value="">كل الحالات</option>
              <option value="waiting">قيد الانتظار</option>
              <option value="active">فعال</option>
              <option value="expired">منتهي</option>
            </select>
          </CollapsibleSection>

          {/* Category Filter */}
          <CollapsibleSection title="التصنيف">
            <select
              value={filters.category_id}
              onChange={(e) => updateFilter("category_id", e.target.value)}
              className="w-full px-3 py-2 border-gray-300 border rounded-lg bg-background text-foreground focus:border-sky-400 outline-none"
            >
              <option value="">جميع التصنيفات</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.title_ar}
                </option>
              ))}
            </select>
          </CollapsibleSection>

          {/* Discount Type Filter */}
          <CollapsibleSection title="نوع الخصم">
            <select
              value={filters.discount_type}
              onChange={(e) => updateFilter("discount_type", e.target.value)}
              className="w-full px-3 py-2 border-gray-300 border rounded-lg bg-background text-foreground focus:border-sky-400 outline-none"
            >
              <option value="">كل الأنواع</option>
              <option value="percentage">نسبة مئوية</option>
              <option value="fixed">قيمة ثابتة</option>
            </select>
          </CollapsibleSection>

          {/* Date Range Filter */}
          <CollapsibleSection title="نطاق التاريخ">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">
                  تاريخ البداية
                </label>
                <input
                  type="date"
                  value={filters.start_date}
                  onChange={(e) => updateFilter("start_date", e.target.value)}
                  className="w-full px-3 py-2 border-gray-300 border rounded-lg bg-background text-foreground focus:border-sky-400 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">
                  تاريخ الانتهاء
                </label>
                <input
                  type="date"
                  value={filters.end_date}
                  onChange={(e) => updateFilter("end_date", e.target.value)}
                  className="w-full px-3 py-2 border-gray-300 border rounded-lg bg-background text-foreground focus:border-sky-400 outline-none"
                />
              </div>
            </div>
          </CollapsibleSection>
        </motion.div>
      )}
    </>
  );
}
