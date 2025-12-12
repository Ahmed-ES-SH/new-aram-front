"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiSearch,
  FiFilter,
  FiX,
  FiChevronDown,
  FiGrid,
  FiList,
} from "react-icons/fi";
import { useLocale, useTranslations } from "next-intl";

import { directionMap } from "@/app/constants/_website/global";
import { instance } from "@/app/_helpers/axios";
import { category } from "@/app/types/_dashboard/GlobalTypes";
import ServicePageUserCard, {
  ServicePageData,
} from "../_services/ServicePageUserCard";
import LoadingSpin from "../../LoadingSpin";
import Pagination from "../../PaginationComponent";

interface ServicePagesListProps {
  initialServices?: ServicePageData[];
  categories?: category[];
  initialLastPage?: number;
}

export default function ServicePagesListComponent({
  initialServices,
  categories = [],
  initialLastPage = 1,
}: ServicePagesListProps) {
  const locale = useLocale();
  const t = useTranslations("services");
  const isInitialMount = useRef(true);

  // State
  const [services, setServices] = useState<ServicePageData[]>(
    initialServices || []
  );
  const [loading, setLoading] = useState(!initialServices);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(initialLastPage);
  const [totalCount, setTotalCount] = useState(0);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedType, setSelectedType] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("order");
  const [sortOrder, setSortOrder] = useState<string>("asc");
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      if (searchQuery !== debouncedSearch) {
        setCurrentPage(1);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch data
  useEffect(() => {
    if (isInitialMount.current && initialServices) {
      isInitialMount.current = false;
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        params.set("page", currentPage.toString());
        params.set("is_active", "true");
        if (debouncedSearch) params.set("search", debouncedSearch);
        if (selectedCategory) params.set("category_id", selectedCategory);
        if (selectedType) params.set("type", selectedType);
        if (sortBy) params.set("sort_by", sortBy);
        if (sortOrder) params.set("sort_order", sortOrder);

        const response = await instance.get(
          `/service-pages?${params.toString()}`
        );

        if (response.status === 200) {
          setServices(response.data.data);
          setLastPage(response.data.pagination?.last_page || 1);
          setTotalCount(response.data.pagination?.total || 0);
        }
      } catch (error) {
        console.error("Error fetching services:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [
    currentPage,
    debouncedSearch,
    selectedCategory,
    selectedType,
    sortBy,
    sortOrder,
  ]);

  // Reset page on filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, selectedType, sortBy, sortOrder]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= lastPage) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("");
    setSelectedType("");
    setSortBy("order");
    setSortOrder("asc");
  };

  const hasActiveFilters = !!(
    searchQuery ||
    selectedCategory ||
    selectedType ||
    sortBy !== "order"
  );

  return (
    <main className="min-h-screen pt-24 bg-gray-50" dir={directionMap[locale]}>
      {/* Hero Section */}
      <section className="relative bg-linear-to-br from-primary/10 via-white to-primary/5 py-16 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        </div>

        <div className="c-container relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              اكتشف خدماتنا المميزة
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              مجموعة متنوعة من الخدمات والمنتجات المصممة خصيصاً لتلبية احتياجاتك
            </p>

            {/* Search Bar */}
            <div className="relative max-w-xl mx-auto">
              <FiSearch className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث عن خدمة..."
                className="w-full pr-12 pl-4 py-4 rounded-2xl border-2 border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all text-lg"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <FiX className="w-5 h-5" />
                </button>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Filters & Content */}
      <section className="c-container py-12">
        {/* Filter Bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-8"
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Left Side - Filters */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Filter Toggle (Mobile) */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="md:hidden flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-xl text-gray-700"
              >
                <FiFilter />
                <span>الفلاتر</span>
                {hasActiveFilters && (
                  <span className="w-2 h-2 bg-primary rounded-full" />
                )}
              </button>

              {/* Category Filter */}
              <div className="hidden md:block relative">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="appearance-none pl-10 pr-4 py-2.5 bg-gray-100 hover:bg-gray-200 rounded-xl text-gray-700 cursor-pointer transition-colors outline-none"
                >
                  <option value="">جميع التصنيفات</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {locale === "ar" ? cat.title_ar : cat.title_en}
                    </option>
                  ))}
                </select>
                <FiChevronDown className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
              </div>

              {/* Type Filter */}
              <div className="hidden md:flex items-center gap-2 bg-gray-100 rounded-xl p-1">
                {[
                  { value: "", label: "الكل" },
                  { value: "service", label: "خدمات" },
                  { value: "product", label: "منتجات" },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setSelectedType(option.value)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      selectedType === option.value
                        ? "bg-white text-gray-900 shadow-sm"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>

              {/* Sort */}
              <div className="hidden md:block relative">
                <select
                  value={`${sortBy}-${sortOrder}`}
                  onChange={(e) => {
                    const [by, order] = e.target.value.split("-");
                    setSortBy(by);
                    setSortOrder(order);
                  }}
                  className="appearance-none pl-10 pr-4 py-2.5 bg-gray-100 hover:bg-gray-200 rounded-xl text-gray-700 cursor-pointer transition-colors outline-none"
                >
                  <option value="order-asc">الترتيب الافتراضي</option>
                  <option value="created_at-desc">الأحدث أولاً</option>
                  <option value="created_at-asc">الأقدم أولاً</option>
                  <option value="price-asc">السعر: من الأقل</option>
                  <option value="price-desc">السعر: من الأعلى</option>
                </select>
                <FiChevronDown className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
              </div>

              {/* Clear Filters */}
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="hidden md:flex items-center gap-1.5 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <FiX className="w-4 h-4" />
                  مسح الفلاتر
                </button>
              )}
            </div>

            {/* Right Side - View & Count */}
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500">
                {loading ? "..." : `${totalCount} نتيجة`}
              </span>

              {/* View Mode Toggle */}
              <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-lg transition-all ${
                    viewMode === "grid"
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-500"
                  }`}
                >
                  <FiGrid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-lg transition-all ${
                    viewMode === "list"
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-500"
                  }`}
                >
                  <FiList className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Filters Dropdown */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="md:hidden overflow-hidden"
              >
                <div className="pt-4 mt-4 border-t border-gray-100 space-y-4">
                  {/* Category */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      التصنيف
                    </label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full p-3 bg-gray-100 rounded-xl outline-none"
                    >
                      <option value="">جميع التصنيفات</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {locale === "ar" ? cat.title_ar : cat.title_en}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      النوع
                    </label>
                    <div className="flex gap-2">
                      {[
                        { value: "", label: "الكل" },
                        { value: "service", label: "خدمات" },
                        { value: "product", label: "منتجات" },
                      ].map((option) => (
                        <button
                          key={option.value}
                          onClick={() => setSelectedType(option.value)}
                          className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all ${
                            selectedType === option.value
                              ? "bg-primary text-white"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Sort */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      الترتيب
                    </label>
                    <select
                      value={`${sortBy}-${sortOrder}`}
                      onChange={(e) => {
                        const [by, order] = e.target.value.split("-");
                        setSortBy(by);
                        setSortOrder(order);
                      }}
                      className="w-full p-3 bg-gray-100 rounded-xl outline-none"
                    >
                      <option value="order-asc">الترتيب الافتراضي</option>
                      <option value="created_at-desc">الأحدث أولاً</option>
                      <option value="created_at-asc">الأقدم أولاً</option>
                      <option value="price-asc">السعر: من الأقل</option>
                      <option value="price-desc">السعر: من الأعلى</option>
                    </select>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <LoadingSpin />
          </div>
        ) : services.length === 0 ? (
          <EmptyState onClear={clearFilters} hasFilters={hasActiveFilters} />
        ) : (
          <>
            {/* Services Grid */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                  : "space-y-4"
              }
            >
              {services.map((service, index) => (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <ServicePageUserCard
                    service={service}
                    variant={viewMode === "list" ? "compact" : "default"}
                  />
                </motion.div>
              ))}
            </motion.div>

            {/* Pagination */}
            {lastPage > 1 && (
              <div className="mt-12">
                <Pagination
                  currentPage={currentPage}
                  totalPages={lastPage}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </>
        )}
      </section>
    </main>
  );
}

// Empty State Component
function EmptyState({
  onClear,
  hasFilters,
}: {
  onClear: () => void;
  hasFilters: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center py-20 text-center"
    >
      <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
        <FiSearch className="w-10 h-10 text-gray-400" />
      </div>
      <h3 className="text-2xl font-bold text-gray-800 mb-2">لا توجد نتائج</h3>
      <p className="text-gray-500 max-w-md mb-6">
        {hasFilters
          ? "لم نجد خدمات تطابق معايير البحث. جرب تغيير الفلاتر."
          : "لا توجد خدمات متاحة حالياً."}
      </p>
      {hasFilters && (
        <button
          onClick={onClear}
          className="px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-colors"
        >
          مسح الفلاتر
        </button>
      )}
    </motion.div>
  );
}
