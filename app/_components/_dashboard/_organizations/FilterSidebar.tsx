"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  FaSearch,
  FaFilter,
  FaTimes,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
import { useAppDispatch, useAppSelector } from "@/app/Store/hooks";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import SearchBox from "./ui/SearchBox";
import RenderStars from "../../_website/_global/RenderStars";
import { setSidebardashOrgs } from "@/app/Store/variablesSlice";

export function FilterSidebar() {
  const { categories } = useAppSelector((state) => state.categories);
  const { sidebardashOrgs } = useAppSelector((state) => state.variables);
  const dispatch = useAppDispatch();

  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const [expandedSections, setExpandedSections] = useState({
    category: true,
    status: true,
    rating: true,
    active: true,
  });

  const onToggle = () => {
    dispatch(setSidebardashOrgs(!sidebardashOrgs));
  };

  // Read filters from searchParams
  const filters = {
    search: searchParams.get("query") ?? "",
    categories: searchParams.get("categories")?.split(",").map(Number) ?? [],
    status: searchParams.get("status")?.split(",") ?? [],
    rating: Number(searchParams.get("rating") ?? 0),
    active:
      searchParams.get("active") === "true"
        ? true
        : searchParams.get("active") === "false"
        ? false
        : null,
  };

  // Update params in URL (single value only for status)
  const updateParam = (key: string, value: string | number | null) => {
    const params = new URLSearchParams(searchParams.toString());

    const stringValue = value !== null ? String(value) : null;

    if (stringValue && params.get(key) === stringValue) {
      // If same value selected again -> remove it
      params.delete(key);
    } else if (stringValue && stringValue !== "" && stringValue !== "null") {
      // Always replace with the new value
      params.set(key, stringValue);
    } else {
      params.delete(key);
    }

    params.set("page", "1"); // Reset page on filter change
    router.replace(`${pathname}?${params.toString()}`);
  };

  // Status options with Arabic labels
  const statusOptions = [
    { value: "published", label: "منشور" },
    { value: "not_published", label: "غير منشور" },
    { value: "under_review", label: "قيد المراجعة" },
  ];

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const sidebarVariants = {
    open: { x: 0, opacity: 1 },
    closed: { x: "-100%", opacity: 0 },
  };

  return (
    <motion.div
      variants={sidebarVariants}
      initial="closed"
      animate={sidebardashOrgs ? "open" : "closed"}
      className="fixed lg:sticky top-0 left-0 h-screen lg:h-fit w-96 bg-white shadow-lg lg:shadow-none z-50 overflow-y-auto max-lg:z-[99999]"
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <FaFilter className="text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-900">الفلاتر</h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => router.replace(pathname)} // clear all
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              مسح الكل
            </button>
            <button
              onClick={onToggle}
              className="lg:hidden p-1 text-gray-400 hover:text-gray-600"
            >
              <FaTimes />
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <SearchBox />
          </div>
        </div>

        {/* Categories */}
        <div className="mb-6">
          <button
            onClick={() => toggleSection("category")}
            className="flex items-center justify-between w-full text-left mb-2"
          >
            <span className="font-medium text-gray-800">التصنيفات</span>
            {expandedSections.category ? <FaChevronUp /> : <FaChevronDown />}
          </button>
          {expandedSections.category && (
            <div className="space-y-2">
              {categories.map((category) => {
                const isChecked = filters.categories.includes(category.id);
                const newCategories = isChecked
                  ? filters.categories.filter((id) => id !== category.id)
                  : [...filters.categories, category.id];

                return (
                  <label
                    key={category.id}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() =>
                        updateParam("categories", newCategories.join(","))
                      }
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">
                      {category.title_ar}
                    </span>
                  </label>
                );
              })}
            </div>
          )}
        </div>

        {/* Status */}
        <div className="mb-6">
          <button
            onClick={() => toggleSection("status")}
            className="flex items-center justify-between w-full text-left mb-2"
          >
            <span className="font-medium text-gray-800">الحالة</span>
            {expandedSections.status ? <FaChevronUp /> : <FaChevronDown />}
          </button>
          {expandedSections.status && (
            <div className="space-y-2">
              {statusOptions.map((option) => {
                const isChecked = filters.status.includes(option.value);
                return (
                  <label
                    key={option.value}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="radio"
                      checked={isChecked}
                      onChange={() => updateParam("status", option.value)}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">
                      {option.label}
                    </span>
                  </label>
                );
              })}
            </div>
          )}
        </div>

        {/* Rating */}
        <div className="mb-6">
          <button
            onClick={() => toggleSection("rating")}
            className="flex items-center justify-between w-full text-left mb-2"
          >
            <span className="font-medium text-gray-800">التقييم</span>
            {expandedSections.rating ? <FaChevronUp /> : <FaChevronDown />}
          </button>
          {expandedSections.rating && (
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((star) => (
                <label
                  key={star}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="rating"
                    checked={filters.rating === star}
                    onChange={() => updateParam("rating", String(star))}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <RenderStars rating={star} />
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Active */}
        <div className="mb-6">
          <button
            onClick={() => toggleSection("active")}
            className="flex items-center justify-between w-full text-left mb-2"
          >
            <span className="font-medium text-gray-800">التفعيل</span>
            {expandedSections.active ? <FaChevronUp /> : <FaChevronDown />}
          </button>
          {expandedSections.active && (
            <div className="space-y-2">
              {[
                { label: "مفعل", value: "true" },
                { label: "غير مفعل", value: "false" },
              ].map((opt) => (
                <label
                  key={opt.value}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="active"
                    checked={String(filters.active) === opt.value}
                    onChange={() => updateParam("active", opt.value)}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{opt.label}</span>
                </label>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
