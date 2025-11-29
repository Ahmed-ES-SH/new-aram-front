"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiFilter,
  FiEye,
  FiUserPlus,
  FiShoppingCart,
  FiCalendar,
  FiGlobe,
  FiMonitor,
  FiChevronDown,
} from "react-icons/fi";
import { PromotionActivity } from "./types";
import Pagination from "../../PaginationComponent";
import { instance } from "@/app/_helpers/axios";
import { useParams } from "next/navigation";
import { VscLoading } from "react-icons/vsc";

interface ActivityLogProps {
  activitiesData: {
    data: PromotionActivity[];
    last_page: number;
    total: number;
    per_page: number;
  };
}

type ActivityType = "all" | "visit" | "registration" | "purchase";

export default function ActivityLog({ activitiesData }: ActivityLogProps) {
  const params = useParams();
  const promoterId = params.promoterId;

  const [typeFilter, setTypeFilter] = useState<ActivityType>("all");
  const [countryFilter, setCountryFilter] = useState<string>("all");
  const [deviceFilter, setDeviceFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("");
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [activities, setActivities] = useState<PromotionActivity[]>(
    activitiesData.data ?? []
  );
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [lastPage, setLastPage] = useState<number>(
    activitiesData.last_page ?? 1
  );
  const [hyparid, setHyparid] = useState(false);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= lastPage) {
      if (!hyparid) setHyparid(true);
      setCurrentPage(newPage);
    }
  };

  const countries = useMemo(
    () => [...new Set(activities.map((a) => a.country))],
    [activities]
  );
  const devices = useMemo(
    () => [...new Set(activities.map((a) => a.device_type))],
    [activities]
  );

  const filteredActivities = useMemo(() => {
    return activities.filter((activity) => {
      if (typeFilter !== "all" && activity.activity_type !== typeFilter)
        return false;
      if (countryFilter !== "all" && activity.country !== countryFilter)
        return false;
      if (deviceFilter !== "all" && activity.device_type !== deviceFilter)
        return false;
      if (dateFilter) {
        const activityDate = new Date(activity.created_at)
          .toISOString()
          .split("T")[0];
        if (activityDate !== dateFilter) return false;
      }
      return true;
    });
  }, [activities, typeFilter, countryFilter, deviceFilter, dateFilter]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "visit":
        return <FiEye className="w-4 h-4" />;
      case "signup":
        return <FiUserPlus className="w-4 h-4" />;
      case "purchase":
        return <FiShoppingCart className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "visit":
        return "زيارة";
      case "signup":
        return "تسجيل";
      case "purchase":
        return "شراء";
      default:
        return type;
    }
  };

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case "visit":
        return "bg-blue-100 text-blue-700";
      case "signup":
        return "bg-green-100 text-green-700";
      case "purchase":
        return "bg-purple-100 text-purple-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await instance.get(
          `/promoter-data?page=${currentPage}&account_type=user&account_id=${promoterId}`
        );
        if (response.status == 200) {
          setActivities(response.data.data);
          setLastPage(response.data.pagination.last_page);
        }
      } catch (error: any) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    if (hyparid) fetchData();
  }, [promoterId, currentPage, hyparid]);

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="space-y-4"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-foreground">سجل النشاطات</h2>
        <button
          onClick={() => setIsFiltersOpen(!isFiltersOpen)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-card border border-border hover:bg-secondary transition-colors"
        >
          <FiFilter className="w-4 h-4" />
          <span>الفلاتر</span>
          <FiChevronDown
            className={`w-4 h-4 transition-transform ${
              isFiltersOpen ? "rotate-180" : ""
            }`}
          />
        </button>
      </div>

      {/* Filters */}
      <AnimatePresence>
        {isFiltersOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-card rounded-xl border border-border p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Type Filter */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                  <FiEye className="w-4 h-4" />
                  النوع
                </label>
                <select
                  value={typeFilter}
                  onChange={(e) =>
                    setTypeFilter(e.target.value as ActivityType)
                  }
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-primary"
                >
                  <option value="all">الكل</option>
                  <option value="visit">زيارة</option>
                  <option value="registration">تسجيل</option>
                  <option value="purchase">شراء</option>
                </select>
              </div>

              {/* Country Filter */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                  <FiGlobe className="w-4 h-4" />
                  الدولة
                </label>
                <select
                  value={countryFilter}
                  onChange={(e) => setCountryFilter(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-primary"
                >
                  <option value="all">الكل</option>
                  {countries.map((country) => (
                    <option key={country} value={country}>
                      {country}
                    </option>
                  ))}
                </select>
              </div>

              {/* Device Filter */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                  <FiMonitor className="w-4 h-4" />
                  الجهاز
                </label>
                <select
                  value={deviceFilter}
                  onChange={(e) => setDeviceFilter(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-primary"
                >
                  <option value="all">الكل</option>
                  {devices.map((device) => (
                    <option key={device} value={device}>
                      {device}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date Filter */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                  <FiCalendar className="w-4 h-4" />
                  التاريخ
                </label>
                <input
                  type="date"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Table */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-400">
              <tr>
                <th className="px-4 py-3 text-right text-sm font-semibold text-foreground">
                  النوع
                </th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-foreground">
                  الدولة
                </th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-foreground">
                  الجهاز
                </th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-foreground">
                  IP
                </th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-foreground">
                  العمولة
                </th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-foreground">
                  التاريخ
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr className="h-[70vh]">
                  <td colSpan={7}>
                    <div className="flex items-center justify-center h-full">
                      <VscLoading className="size-24 text-primary animate-spin" />
                    </div>
                  </td>
                </tr>
              ) : (
                // البيانات العادية
                <>
                  {filteredActivities.slice(0, 20).map((activity, index) => (
                    <motion.tr
                      key={activity.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.02 }}
                      className="hover:bg-secondary/50 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${getTypeBadgeColor(
                            activity.activity_type
                          )}`}
                        >
                          {getTypeIcon(activity.activity_type)}
                          {getTypeLabel(activity.activity_type)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-foreground">
                        {activity.country}
                      </td>
                      <td className="px-4 py-3 text-sm text-foreground">
                        {activity.device_type}
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground font-mono">
                        {activity.ip_address}
                      </td>
                      <td className="px-4 py-3 text-sm text-foreground">
                        {activity.commission_amount
                          ? `${activity.commission_amount.toLocaleString(
                              "ar-EG"
                            )} ر.ع`
                          : "-"}
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">
                        {new Date(activity.created_at).toLocaleDateString(
                          "ar-EG",
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                      </td>
                    </motion.tr>
                  ))}
                  <motion.tr>
                    <td colSpan={6} className="px-4 py-4">
                      <Pagination
                        currentPage={currentPage}
                        totalPages={lastPage}
                        onPageChange={handlePageChange}
                      />
                    </td>
                  </motion.tr>
                </>
              )}
            </tbody>
          </table>
        </div>
        {filteredActivities.length === 0 && (
          <div className="p-8 text-center text-muted-foreground">
            لا توجد نشاطات مطابقة للفلاتر المحددة
          </div>
        )}
        {filteredActivities.length > 20 && (
          <div className="p-4 text-center text-sm text-muted-foreground border-t border-border">
            يتم عرض {activitiesData.per_page} من أصل
            {activitiesData.total.toLocaleString("ar-EG")} نشاط
          </div>
        )}
      </div>
    </motion.section>
  );
}
