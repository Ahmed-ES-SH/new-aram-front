"use client";
import FilterSidebar from "@/app/_components/_dashboard/_services/FilterSidebar";
import ServiceDashCard from "@/app/_components/_dashboard/_services/ServiceDashCard";
import { Service } from "@/app/_components/_dashboard/_services/types";
import LoadingSpin from "@/app/_components/LoadingSpin";
import Pagination from "@/app/_components/PaginationComponent";
import { instance } from "@/app/_helpers/axios";
import { useAppDispatch } from "@/app/Store/hooks";
import { setServicesFilterSidebar } from "@/app/Store/variablesSlice";
import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { FaBars, FaGripHorizontal } from "react-icons/fa";

interface filters {
  category: string;
  status: string;
  rating: string;
  isExclusive: string;
  benefitType: string;
  dateFrom: string;
  dateTo: string;
  query: string;
}

export default function ServicesDashPage() {
  const dispatch = useAppDispatch();

  const [services, setServices] = useState<Service[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState<filters>({
    category: "",
    status: "",
    rating: "",
    isExclusive: "",
    benefitType: "",
    dateFrom: "",
    dateTo: "",
    query: "",
  });

  useEffect(() => {
    const handler = setTimeout(async () => {
      setLoading(true);
      try {
        // تحويل الفلاتر إلى query string
        const queryParams = new URLSearchParams();

        Object.entries(filters).forEach(([key, value]) => {
          if (value) {
            if (key === "category") {
              queryParams.set("category_id", value); // special case
            } else {
              queryParams.set(key, value);
            }
          }
        });

        const endpoint = `/dashboard/services${
          queryParams.toString() ? `?${queryParams.toString()}` : ""
        }`;
        const response = await instance.get(endpoint);
        setServices(response.data.data);
        setLastPage(response.data.pagination.last_page);
        setCurrentPage(response.data.pagination.current_page);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(handler); // تنظيف المؤقت إذا تغيرت الفلاتر قبل انتهاء المدة
  }, [filters]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= lastPage) {
      setCurrentPage(newPage);
    }
  };

  if (loading) return <LoadingSpin />;

  return (
    <>
      <div className="min-h-screen bg-gray-50" dir="rtl">
        <div className="flex">
          {/* Sidebar */}
          <div className="block lg:w-80 flex-shrink-0">
            <FilterSidebar filters={filters} setFilters={setFilters} />
          </div>

          {/* Main Content */}
          <div className="flex-1 p-6">
            <div id="main-content" className="">
              {/* Header */}
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    لوحة إدارة الخدمات
                  </h1>
                  <p className="text-gray-600">
                    إجمالي الخدمات: {services.length} من {services.length}
                  </p>
                </div>

                <button
                  onClick={() => dispatch(setServicesFilterSidebar(true))}
                  className="lg:hidden bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <FaBars />
                </button>
              </div>

              {/* Services Grid */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
              >
                {services.map((service, index) => (
                  <motion.div
                    key={service.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <ServiceDashCard
                      setServices={setServices}
                      service={service}
                    />
                  </motion.div>
                ))}
              </motion.div>

              {/* Empty State */}
              {services.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center min-h-[90vh] flex items-center justify-center py-16"
                >
                  <div className="">
                    <FaGripHorizontal className="mx-auto text-6xl text-gray-300 mb-4" />
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">
                      لا توجد خدمات
                    </h3>
                    <p className="text-gray-500">
                      لم يتم العثور على خدمات تطابق المرشحات المحددة
                    </p>
                  </div>
                </motion.div>
              )}
            </div>
            {/* pagination Component */}
            <Pagination
              currentPage={currentPage}
              totalPages={lastPage}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      </div>
    </>
  );
}
