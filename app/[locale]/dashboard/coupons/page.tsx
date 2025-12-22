"use client";
import CouponDashCard from "@/app/_components/_dashboard/_coupons/CouponDashCard";
import FilterSidebar from "@/app/_components/_dashboard/_coupons/FilterSidebar";
import { Coupon, Filters } from "@/app/_components/_dashboard/_coupons/types";
import LoadingSpin from "@/app/_components/LoadingSpin";
import Pagination from "@/app/_components/PaginationComponent";
import { instance } from "@/app/_helpers/axios";
import { useAppDispatch } from "@/app/Store/hooks";
import { setCouponsFilterSidebar } from "@/app/Store/variablesSlice";
import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { FaBars, FaGripHorizontal } from "react-icons/fa";

export default function CouponsDashPage() {
  const dispatch = useAppDispatch();

  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState<Filters>({
    category: "",
    status: "",
    benefitType: "",
    type: "",
    dateFrom: "",
    dateTo: "",
    query: "",
  });

  useEffect(() => {
    const handler = setTimeout(async () => {
      setLoading(true);
      try {
        // build query string
        const queryParams = new URLSearchParams();

        Object.entries(filters).forEach(([key, value]) => {
          if (value) {
            if (key === "category") {
              queryParams.set("category_id", value); // special case
            } else {
              queryParams.set(key, value.toString());
            }
          }
        });

        // ✅ add current page
        queryParams.set("page", currentPage.toString());

        const endpoint = `/dashboard/coupons?${queryParams.toString()}`;
        const response = await instance.get(endpoint);

        setCoupons(response.data.data);
        setLastPage(response.data.pagination.last_page);
        setCurrentPage(response.data.pagination.current_page);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, 300); // debounce

    return () => clearTimeout(handler);
  }, [filters, currentPage]);

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
            <div className=" min-h-screen">
              <div id="main-content">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                      لوحة إدارة الكوبونات
                    </h1>
                  </div>

                  <button
                    onClick={() => dispatch(setCouponsFilterSidebar(true))}
                    className="lg:hidden bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <FaBars />
                  </button>
                </div>

                {/* Coupons Grid */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                >
                  {coupons.map((coupon, index) => (
                    <motion.div
                      key={coupon.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <CouponDashCard setCoupons={setCoupons} coupon={coupon} />
                    </motion.div>
                  ))}
                </motion.div>

                {/* Empty State */}
                {coupons.length === 0 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center min-h-[90vh] flex items-center justify-center py-16"
                  >
                    <div>
                      <FaGripHorizontal className="mx-auto text-6xl text-gray-300 mb-4" />
                      <h3 className="text-xl font-semibold text-gray-600 mb-2">
                        لا توجد كوبونات
                      </h3>
                      <p className="text-gray-500">
                        لم يتم العثور على كوبونات تطابق المرشحات المحددة
                      </p>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
            {/* Pagination */}
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
