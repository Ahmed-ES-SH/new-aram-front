"use client";
import React, { useEffect, useState } from "react";
import { instance } from "@/app/_helpers/axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiFilter,
  FiSearch,
  FiRefreshCw,
  FiChevronDown,
  FiChevronUp,
  FiDollarSign,
  FiClock,
  FiShoppingBag,
  FiLayers,
  FiActivity,
} from "react-icons/fi";

interface Category {
  id: number;
  title_ar: string;
  title_en: string;
}

interface FilterState {
  query: string;
  category_id: string;
  active: string;
  min_price: string;
  max_price: string;
  duration: string;
  number_of_promotional_purchases: string;
}

interface CardsFilterSidebarProps {
  onFilterChange: (filters: any) => void;
}

export default function CardsFilterSidebar({
  onFilterChange,
}: CardsFilterSidebarProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingDefaults, setLoadingDefaults] = useState(true);
  const [filters, setFilters] = useState<FilterState>({
    query: "",
    category_id: "",
    active: "",
    min_price: "",
    max_price: "",
    duration: "",
    number_of_promotional_purchases: "",
  });

  // Fetch Categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await instance.get("/card-categories");
        if (response.status === 200) {
          setCategories(response.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch categories", error);
      } finally {
        setLoadingDefaults(false);
      }
    };

    fetchCategories();
  }, []);

  // Handle Input Change
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFilters((prev) => {
      const newFilters = { ...prev, [name]: value };
      return newFilters;
    });
  };

  const handleApply = () => {
    onFilterChange(filters);
  };

  const handleReset = () => {
    const resetFilters = {
      query: "",
      category_id: "",
      active: "",
      min_price: "",
      max_price: "",
      duration: "",
      number_of_promotional_purchases: "",
    };
    setFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-fit sticky top-6 w-full lg:w-80 flex-shrink-0 font-sans">
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-100">
        <h3 className="font-bold text-xl text-gray-800 flex items-center gap-3">
          <span className="p-2 bg-blue-50 text-blue-600 rounded-lg">
            <FiFilter size={20} />
          </span>
          تصفية النتائج
        </h3>
        <button
          onClick={handleReset}
          className="text-xs font-medium text-gray-500 hover:text-red-600 bg-gray-50 hover:bg-red-50 px-3 py-1.5 rounded-full transition-all flex items-center gap-1.5"
        >
          <FiRefreshCw size={12} />
          <span>إعادة تعيين</span>
        </button>
      </div>

      <div className="space-y-6">
        {/* Search */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700 block">
            بحث في البطاقات
          </label>
          <div className="relative group">
            <input
              type="text"
              name="query"
              value={filters.query}
              onChange={handleChange}
              placeholder="ابحث عن اسم البطاقة..."
              className="w-full pl-4 pr-10 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all text-sm"
            />
            <FiSearch
              className="absolute right-3.5 top-3.5 text-gray-400 group-focus-within:text-blue-500 transition-colors"
              size={18}
            />
          </div>
        </div>

        {/* Categories */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <FiLayers className="text-gray-400" />
            التصنيف
          </label>
          <div className="relative">
            <select
              name="category_id"
              value={filters.category_id}
              onChange={handleChange}
              className="w-full pl-4 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all text-sm appearance-none cursor-pointer"
              disabled={loadingDefaults}
            >
              <option value="">جميع التصنيفات</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.title_ar}
                </option>
              ))}
            </select>
            <div className="absolute left-3.5 top-4 pointer-events-none text-gray-400">
              <FiChevronDown />
            </div>
          </div>
        </div>

        {/* Status */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <FiActivity className="text-gray-400" />
            الحالة
          </label>
          <div className="relative">
            <select
              name="active"
              value={filters.active}
              onChange={handleChange}
              className="w-full pl-4 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all text-sm appearance-none cursor-pointer"
            >
              <option value="">الكل</option>
              <option value="1">نشط</option>
              <option value="0">غير نشط</option>
            </select>
            <div className="absolute left-3.5 top-4 pointer-events-none text-gray-400">
              <FiChevronDown />
            </div>
          </div>
        </div>

        {/* Price Range */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <FiDollarSign className="text-gray-400" />
            نطاق السعر
          </label>
          <div className="grid grid-cols-2 gap-3">
            <div className="relative">
              <input
                type="number"
                name="min_price"
                value={filters.min_price}
                onChange={handleChange}
                placeholder="من"
                className="w-full px-3 py-2.5 bg-gray-50 border border-gray-100 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all text-sm text-center"
              />
            </div>
            <div className="relative">
              <input
                type="number"
                name="max_price"
                value={filters.max_price}
                onChange={handleChange}
                placeholder="إلى"
                className="w-full px-3 py-2.5 bg-gray-50 border border-gray-100 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all text-sm text-center"
              />
            </div>
          </div>
        </div>

        {/* Duration */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <FiClock className="text-gray-400" />
            المدة (أيام)
          </label>
          <input
            type="number"
            name="duration"
            value={filters.duration}
            onChange={handleChange}
            placeholder="مثال: 30"
            className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all text-sm"
          />
        </div>

        {/* Promotional Purchases */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <FiShoppingBag className="text-gray-400" />
            مشتريات ترويجية
          </label>
          <input
            type="number"
            name="number_of_promotional_purchases"
            value={filters.number_of_promotional_purchases}
            onChange={handleChange}
            placeholder="العدد..."
            className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all text-sm"
          />
        </div>

        {/* Divider */}
        <div className="h-px bg-gray-100 w-full my-4"></div>

        {/* Action Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleApply}
          className="w-full bg-gradient-to-l from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-blue-200 flex items-center justify-center gap-2"
        >
          <FiFilter />
          تطبيق الفلاتر
        </motion.button>
      </div>
    </div>
  );
}
