"use client";

import { useState, useEffect, useCallback } from "react";
import { AdminServiceOrder } from "./types";
import ServiceOrdersSidebar from "./ServiceOrdersSidebar";
import ServiceOrderCard from "./ServiceOrderCard";
import { instance } from "@/app/_helpers/axios";
import { FiInbox, FiRefreshCw, FiAlertCircle } from "react-icons/fi";
import { VscLoading } from "react-icons/vsc";
import Pagination from "../../PaginationComponent";
import NoServiceOrders from "./NoServiceOrders";

interface ServiceOrdersContainerProps {
  initialOrders: AdminServiceOrder[];
  last_page: number;
}

export default function ServiceOrdersContainer({
  initialOrders,
  last_page,
}: ServiceOrdersContainerProps) {
  const [orders, setOrders] = useState<AdminServiceOrder[]>(initialOrders);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(last_page ?? 1);
  const [fire, setFire] = useState(false);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= lastPage) {
      setCurrentPage(newPage);
      if (!fire) setFire(true);
    }
  };

  // Filter State
  const [filters, setFilters] = useState({
    status: "",
    payment_status: "",
    subscription_status: "",
    user_type: "",
    date_from: "",
    date_to: "",
    sort_by: "created_at",
    sort_order: "desc",
  });

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams();

      // Map filters to params
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });

      // Assuming the endpoint is the same but access via instance for client-side
      const response = await instance.get(
        `/all-service-orders?${params.toString()}`
      );

      if (response.data && response.data.data) {
        setOrders(response.data.data);
        setLastPage(response.data.pagination.last_page);
      } else {
        // No data returned
        setOrders([]);
      }
    } catch (err: any) {
      console.error("Failed to fetch orders:", err);
      setError(
        err?.response?.data?.message ||
          "حدث خطأ أثناء تحميل الطلبات. يرجى المحاولة مرة أخرى."
      );
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Debounce effect for fetching when filters change
  useEffect(() => {
    const timer = setTimeout(() => {
      if (fire) fetchOrders();
    }, 500); // 500ms debounce to avoid rapid calls

    return () => clearTimeout(timer);
  }, [filters, fetchOrders, fire]);

  const handleFilterChange = (key: string, value: string) => {
    setFire(true);
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleResetFilters = () => {
    setFilters({
      status: "",
      payment_status: "",
      subscription_status: "",
      user_type: "",
      date_from: "",
      date_to: "",
      sort_by: "created_at",
      sort_order: "desc",
    });
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 min-h-[calc(100vh-120px)] animate-fade-in">
      {/* Sidebar */}
      <ServiceOrdersSidebar
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={handleResetFilters}
      />

      {/* Main Content */}
      <div className="flex-1">
        <div className="flex items-center justify-between mb-8 px-3">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <span className="w-2 h-8 bg-primary rounded-full"></span>
            الطلبات
          </h1>
          <div className="bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100 text-sm font-medium text-gray-500">
            {loading ? (
              <span className="flex items-center gap-2 text-primary">
                <VscLoading className="animate-spin" /> جاري التحميل...
              </span>
            ) : (
              <span>
                الإجمالي:{" "}
                <span className="text-primary font-bold text-lg mx-1">
                  {orders.length}
                </span>{" "}
                طلب
              </span>
            )}
          </div>
        </div>

        <div className="relative min-h-[80vh]">
          {loading && (
            <div className="absolute inset-0 z-10 bg-white/50 backdrop-blur-[2px] rounded-3xl flex items-center justify-center transition-all duration-300">
              <div className="bg-white p-4 rounded-full shadow-xl">
                <VscLoading className="animate-spin text-primary text-3xl" />
              </div>
            </div>
          )}

          {/* Error State */}
          {!loading && error && <NoServiceOrders error={error} />}

          {/* Orders Grid */}
          {!loading && !error && orders && orders.length > 0 && (
            <div className="w-full">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3 gap-6">
                {orders.map((order, index) => (
                  <ServiceOrderCard
                    key={order.id}
                    order={order}
                    index={index}
                  />
                ))}
              </div>

              {/* pagination */}
              <Pagination
                currentPage={currentPage}
                totalPages={lastPage}
                onPageChange={handlePageChange}
              />
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && (!orders || orders.length === 0) && (
            <div className="flex flex-col items-center justify-center py-24 bg-white rounded-3xl border border-dashed border-gray-200 text-center">
              <div className="w-24 h-24 bg-primary/5 rounded-full flex items-center justify-center mb-6 text-primary">
                <FiInbox size={40} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                لا يوجد طلبات
              </h3>
              <p className="text-gray-500 max-w-xs mx-auto mb-6">
                لم يتم العثور على طلبات تطابق معايير البحث الحالية.
              </p>
              <button
                onClick={handleResetFilters}
                className="flex items-center gap-2 px-6 py-2.5 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-all hover:shadow-lg hover:shadow-gray-200"
              >
                <FiRefreshCw />
                <span>إعادة تعيين الفلاتر</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
