"use client";
import React, { Dispatch, SetStateAction, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiFilter, HiX, HiSearch } from "react-icons/hi";
import useFetchData from "@/app/_helpers/FetchDataWithAxios";
import LoadingSpin from "@/app/_components/LoadingSpin";

interface Props {
  query: string;
  setQuery: Dispatch<SetStateAction<string>>;
  categoryId: string;
  setCategoryId: Dispatch<SetStateAction<string>>;
  authorId: string;
  setAuthorId: Dispatch<SetStateAction<string>>;
  status: string;
  setStatus: Dispatch<SetStateAction<string>>;
  fromDate: string;
  setFromDate: Dispatch<SetStateAction<string>>;
  toDate: string;
  setToDate: Dispatch<SetStateAction<string>>;
  resetFilters: () => void;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

export default function ArticlesFilterSidebar({
  query,
  setQuery,
  categoryId,
  setCategoryId,
  authorId,
  setAuthorId,
  status,
  setStatus,
  fromDate,
  setFromDate,
  toDate,
  setToDate,
  resetFilters,
  isOpen,
  setIsOpen,
}: Props) {
  // Fetch Options
  const { data: categories, loading: catLoading } = useFetchData<any[]>(
    "/article-categories",
    false
  );

  const statusOptions = [
    { value: "published", label: "منشور" },
    { value: "draft", label: "مسودة" },
    { value: "archived", label: "مؤرشف" },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={{ x: "100%" }}
        animate={{ x: isOpen ? 0 : "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className={`fixed lg:sticky top-0 right-0 h-screen lg:h-[calc(100vh-2rem)] w-[280px] bg-white shadow-xl lg:shadow-none lg:border-l border-gray-100 z-999999 lg:z-0 overflow-y-auto p-6 ${
          isOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"
        } lg:block`}
        style={{ direction: "rtl" }}
      >
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2 text-gray-800">
            <HiFilter className="w-5 h-5" />
            <h2 className="font-bold text-lg">تصفية المقالات</h2>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-full text-gray-500"
          >
            <HiX className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Search */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">بحث</label>
            <div className="relative">
              <HiSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="عنوان او محتوى المقال..."
                className="w-full pr-10 pl-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
            </div>
          </div>

          {/* Category */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">التصنيف</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="">الكل</option>
              {!catLoading &&
                categories?.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.title_ar || cat.title_en}
                  </option>
                ))}
            </select>
          </div>

          {/* Status */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">الحالة</label>
            <div className="flex flex-wrap gap-2">
              {statusOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() =>
                    setStatus(status === opt.value ? "" : opt.value)
                  }
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    status === opt.value
                      ? "bg-blue-500 text-white shadow-md"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Date Range */}
          <div className="space-y-4 pt-4 border-t border-gray-100">
            <h3 className="text-sm font-medium text-gray-700">التاريخ</h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-gray-500 mb-1 block">من</label>
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">إلى</label>
                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Reset Button */}
          <button
            onClick={resetFilters}
            className="w-full py-2.5 bg-gray-900 text-white rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors shadow-lg mt-6"
          >
            إعادة تعيين
          </button>
        </div>
      </motion.aside>
    </>
  );
}
