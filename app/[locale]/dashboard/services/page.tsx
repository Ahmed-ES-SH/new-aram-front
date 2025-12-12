"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaBars, FaBoxOpen } from "react-icons/fa";

import { useAppDispatch } from "@/app/Store/hooks";
import { setServicesFilterSidebar } from "@/app/Store/variablesSlice";
import { instance } from "@/app/_helpers/axios";
import LoadingSpin from "@/app/_components/LoadingSpin";
import Pagination from "@/app/_components/PaginationComponent";
import {
  ServicePageCard,
  ServicePageFilterSidebar,
  ServicePageMiniature,
  ServicePageFilters,
  DEFAULT_FILTERS,
} from "@/app/_components/_dashboard/_services/_servicePage";

export default function ServicePagesListPage() {
  const dispatch = useAppDispatch();

  // State
  const [servicePages, setServicePages] = useState<ServicePageMiniature[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState<ServicePageFilters>(DEFAULT_FILTERS);

  // Fetch service pages with debounce
  useEffect(() => {
    const controller = new AbortController();

    const fetchServicePages = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();

        // Add all filters to query params
        if (filters.category_id) params.set("category_id", filters.category_id);
        if (filters.type) params.set("type", filters.type);
        if (filters.status) params.set("status", filters.status);
        if (filters.is_active) params.set("is_active", filters.is_active);
        if (filters.min_price) params.set("min_price", filters.min_price);
        if (filters.max_price) params.set("max_price", filters.max_price);
        if (filters.search) params.set("search", filters.search);
        if (filters.from_date) params.set("from_date", filters.from_date);
        if (filters.to_date) params.set("to_date", filters.to_date);
        if (filters.sort_by) params.set("sort_by", filters.sort_by);
        if (filters.sort_order) params.set("sort_order", filters.sort_order);

        // Pagination
        params.set("page", currentPage.toString());

        const endpoint = `/dashboard/service-pages?${params.toString()}`;

        const response = await instance.get(endpoint, {
          signal: controller.signal,
        });

        setServicePages(response.data.data);
        setLastPage(response.data.pagination?.last_page || 1);
        setTotalCount(
          response.data.pagination?.total || response.data.data.length
        );
      } catch (error: any) {
        if (error.name !== "CanceledError") {
          console.error("Failed to fetch service pages:", error);
        }
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(fetchServicePages, 300);

    return () => {
      clearTimeout(debounceTimer);
      controller.abort();
    };
  }, [filters, currentPage]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [
    filters.category_id,
    filters.type,
    filters.status,
    filters.is_active,
    filters.min_price,
    filters.max_price,
    filters.search,
    filters.from_date,
    filters.to_date,
    filters.sort_by,
    filters.sort_order,
  ]);

  // Handle page change
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= lastPage) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Open filter sidebar on mobile
  const handleOpenFilters = () => {
    dispatch(setServicesFilterSidebar(true));
  };

  return (
    <div
      className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100"
      dir="rtl"
    >
      <div className="flex">
        {/* Sidebar Filter */}
        <ServicePageFilterSidebar filters={filters} setFilters={setFilters} />

        {/* Main Content */}
        <main className="flex-1 p-6 lg:p-8">
          {/* Header */}
          <header className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-1">
                صفحات الخدمات
              </h1>
              <p className="text-gray-500">
                {loading ? (
                  <span className="inline-block w-20 h-4 bg-gray-200 rounded animate-pulse" />
                ) : (
                  <>
                    عرض {servicePages.length} من {totalCount} صفحة
                  </>
                )}
              </p>
            </div>

            {/* Mobile Filter Toggle */}
            <button
              onClick={handleOpenFilters}
              className="lg:hidden flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all"
            >
              <FaBars className="text-gray-600" />
              <span className="text-sm font-medium text-gray-700">الفلاتر</span>
            </button>
          </header>

          {/* Content */}
          {loading ? (
            <div className="flex items-center justify-center min-h-[60vh]">
              <LoadingSpin />
            </div>
          ) : servicePages.length === 0 ? (
            <EmptyState />
          ) : (
            <>
              {/* Service Pages Grid */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6"
              >
                <AnimatePresence mode="popLayout">
                  {servicePages.map((servicePage, index) => (
                    <motion.div
                      key={servicePage.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <ServicePageCard
                        servicePage={servicePage}
                        setServicePages={setServicePages}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>

              {/* Pagination */}
              {lastPage > 1 && (
                <div className="mt-8">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={lastPage}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}

// Empty State Component
function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center min-h-[60vh] text-center"
    >
      <div className="p-6 bg-gray-100 rounded-full mb-6">
        <FaBoxOpen className="w-16 h-16 text-gray-400" />
      </div>
      <h3 className="text-2xl font-bold text-gray-800 mb-2">
        لا توجد صفحات خدمات
      </h3>
      <p className="text-gray-500 max-w-md mb-6">
        لم يتم العثور على صفحات خدمات تطابق معايير البحث الحالية.
        <br />
        جرّب تغيير الفلاتر أو إضافة صفحة خدمة جديدة.
      </p>
    </motion.div>
  );
}
