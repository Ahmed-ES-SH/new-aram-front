"use client";

import { useLocale } from "next-intl";
import { motion } from "framer-motion";
import {
  FiFilter,
  FiCalendar,
  FiUser,
  FiDollarSign,
  FiActivity,
  FiRefreshCw,
  FiList,
} from "react-icons/fi";
import CustomSelect from "./CustomSelect";

interface ServiceOrdersSidebarProps {
  filters: any;
  onFilterChange: (key: string, value: string) => void;
  onReset: () => void;
}

export default function ServiceOrdersSidebar({
  filters,
  onFilterChange,
  onReset,
}: ServiceOrdersSidebarProps) {
  const locale = useLocale();

  // Arabic Labels
  const labels = {
    title: "تصفية الطلبات",
    reset: "إعادة تعيين",
    orderStatus: "حالة الطلب",
    paymentStatus: "حالة الدفع",
    userType: "نوع العميل",
    dateRange: "الفترة الزمنية",
    sortBy: "الترتيب",
    all: "الكل",
    pending: "قيد الانتظار",
    inProgress: "جاري التنفيذ",
    completed: "مكتمل",
    cancelled: "ملغي",
    paid: "مدفوع",
    unpaid: "غير مدفوع",
    user: "مستخدم",
    organization: "مركز",
    admin: "مدير",
    date: "التاريخ",
    id: "رقم الطلب",
    newest: "الأحدث",
    oldest: "الأقدم",
    from: "من",
    to: "إلى",
  };

  const statusOptions = [
    { value: "", label: labels.all },
    { value: "pending", label: labels.pending },
    { value: "in_progress", label: labels.inProgress },
    { value: "completed", label: labels.completed },
    { value: "cancelled", label: labels.cancelled },
  ];

  const paymentOptions = [
    { value: "", label: labels.all },
    { value: "paid", label: labels.paid },
    { value: "unpaid", label: labels.unpaid },
    { value: "pending", label: labels.pending },
  ];

  const userTypeOptions = [
    { value: "", label: labels.all },
    { value: "user", label: labels.user },
    { value: "organization", label: labels.organization },
  ];

  const sortByOptions = [
    { value: "created_at", label: labels.date },
    { value: "id", label: labels.id },
  ];

  const sortOrderOptions = [
    { value: "desc", label: labels.newest },
    { value: "asc", label: labels.oldest },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full lg:w-80 shrink-0 lg:h-[calc(100vh-120px)] lg:sticky lg:top-8"
    >
      <div className="bg-white h-full p-6 rounded-3xl  border border-gray-100 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 pb-5 border-b border-gray-50">
          <div className="flex items-center gap-3 text-gray-900 font-bold text-lg">
            <div className="w-11 h-11 rounded-2xl bg-linear-to-br from-primary to-primary/70 flex items-center justify-center text-white shadow-lg shadow-primary/20">
              <FiFilter size={20} />
            </div>
            <h3>{labels.title}</h3>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onReset}
            className="text-xs text-gray-400 hover:text-red-500 font-bold flex items-center gap-1.5 transition-colors bg-gray-50 px-3 py-2 rounded-xl hover:bg-red-50"
          >
            <FiRefreshCw size={12} />
            {labels.reset}
          </motion.button>
        </div>

        {/* Filters - Scrollable Area */}
        <div className="flex-1 overflow-y-auto space-y-6 custom-scrollbar">
          {/* Order Status */}
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
              <FiActivity size={12} />
              {labels.orderStatus}
            </label>
            <CustomSelect
              value={filters.status}
              onChange={(val) => onFilterChange("status", val)}
              options={statusOptions}
              placeholder={labels.all}
            />
          </div>

          {/* Payment Status */}
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
              <FiDollarSign size={12} />
              {labels.paymentStatus}
            </label>
            <CustomSelect
              value={filters.payment_status}
              onChange={(val) => onFilterChange("payment_status", val)}
              options={paymentOptions}
              placeholder={labels.all}
            />
          </div>

          {/* User Type */}
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
              <FiUser size={12} />
              {labels.userType}
            </label>
            <CustomSelect
              value={filters.user_type}
              onChange={(val) => onFilterChange("user_type", val)}
              options={userTypeOptions}
              placeholder={labels.all}
            />
          </div>

          {/* Date Range */}
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
              <FiCalendar size={12} />
              {labels.dateRange}
            </label>
            <div className="grid grid-cols-1 gap-3">
              <div className="relative">
                <span className="absolute top-2 right-3 text-[10px] text-gray-400 font-medium">
                  {labels.from}
                </span>
                <input
                  type="date"
                  value={filters.date_from}
                  onChange={(e) => onFilterChange("date_from", e.target.value)}
                  className="w-full px-3 pt-6 pb-2 rounded-xl border-2 border-gray-100 focus:outline-none focus:border-primary transition-all text-xs bg-white font-medium text-gray-700 hover:border-gray-200"
                />
              </div>
              <div className="relative">
                <span className="absolute top-2 right-3 text-[10px] text-gray-400 font-medium">
                  {labels.to}
                </span>
                <input
                  type="date"
                  value={filters.date_to}
                  onChange={(e) => onFilterChange("date_to", e.target.value)}
                  className="w-full px-3 pt-6 pb-2 rounded-xl border-2 border-gray-100 focus:outline-none focus:border-primary transition-all text-xs bg-white font-medium text-gray-700 hover:border-gray-200"
                />
              </div>
            </div>
          </div>

          {/* Sort By */}
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
              <FiList size={12} />
              {labels.sortBy}
            </label>
            <div className="grid grid-cols-2 gap-3">
              <CustomSelect
                value={filters.sort_by}
                onChange={(val) => onFilterChange("sort_by", val)}
                options={sortByOptions}
                placeholder={labels.date}
              />
              <CustomSelect
                value={filters.sort_order}
                onChange={(val) => onFilterChange("sort_order", val)}
                options={sortOrderOptions}
                placeholder={labels.newest}
              />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
