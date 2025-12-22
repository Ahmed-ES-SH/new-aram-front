"use client";
import { useLocale } from "next-intl";
import { FiFilter, FiSearch } from "react-icons/fi";

export default function ServiceOrdersSidebar() {
  const locale = useLocale();

  return (
    <div className="w-full lg:w-72 shrink-0 space-y-6">
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-2 mb-6 text-gray-900 font-bold">
          <FiFilter className="text-primary" />
          <h3>{locale === "ar" ? "تصفية الطلبات" : "Filter Orders"}</h3>
        </div>

        <div className="space-y-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {locale === "ar" ? "بحث" : "Search"}
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder={locale === "ar" ? "رقم الطلب..." : "Order ID..."}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all text-sm"
              />
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {locale === "ar" ? "الحالة" : "Status"}
            </label>
            <select className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-primary transition-all text-sm bg-white">
              <option value="">{locale === "ar" ? "الكل" : "All"}</option>
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          {/* Type Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {locale === "ar" ? "النوع" : "Type"}
            </label>
            <select className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-primary transition-all text-sm bg-white">
              <option value="">{locale === "ar" ? "الكل" : "All"}</option>
              <option value="subscription">Subscription</option>
              <option value="one_time">One Time</option>
            </select>
          </div>

          <button className="w-full bg-primary text-white py-2.5 rounded-xl font-medium hover:bg-primary/90 transition-colors mt-2">
            {locale === "ar" ? "تطبيق" : "Apply Filter"}
          </button>
        </div>
      </div>
    </div>
  );
}
