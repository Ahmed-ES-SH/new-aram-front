"use client";
import CardDashDisplay from "@/app/_components/_dashboard/_cards/CardComponent";
import CardsFilterSidebar from "@/app/_components/_dashboard/_cards/CardsFilterSidebar";
import { Card } from "@/app/_components/_dashboard/_cards/types";
import LoadingSpin from "@/app/_components/LoadingSpin";
import useFetchData from "@/app/_helpers/FetchDataWithAxios";
import { useEffect, useState } from "react";
import { FiGrid, FiPlus, FiAlertCircle } from "react-icons/fi";
import { motion } from "framer-motion";
import LocaleLink from "@/app/_components/_website/_global/LocaleLink";

export default function CardsPage() {
  const [filterQuery, setFilterQuery] = useState("");
  const { data, loading } = useFetchData<Card[]>(
    `/dashboard/cards${filterQuery}`,
    false
  );

  const [cards, setCards] = useState<Card[]>([]);

  useEffect(() => {
    if (data) {
      setCards(data);
    }
  }, [data]);

  const handleFilterChange = (filters: any) => {
    const params = new URLSearchParams();
    if (filters.query) params.append("query", filters.query);
    if (filters.category_id) params.append("category_id", filters.category_id);
    if (filters.active !== "") params.append("active", filters.active);
    if (filters.min_price) params.append("min_price", filters.min_price);
    if (filters.max_price) params.append("max_price", filters.max_price);
    if (filters.duration) params.append("duration", filters.duration);
    if (filters.number_of_promotional_purchases)
      params.append(
        "number_of_promotional_purchases",
        filters.number_of_promotional_purchases
      );

    const queryString = params.toString();
    setFilterQuery(queryString ? `?${queryString}` : "");
  };

  return (
    <div className="min-h-screen bg-gray-50/50 p-6 md:p-8 font-sans" dir="rtl">
      {/* Page Header */}
      <div className="max-w-[1920px] mx-auto mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="p-3.5 bg-linear-to-br from-blue-600 to-blue-500 rounded-2xl text-white shadow-lg shadow-blue-200">
            <FiGrid size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
              إدارة البطاقات
            </h1>
            <p className="text-gray-500 mt-1.5 text-sm md:text-base">
              عرض والتحكم في جميع البطاقات والخدمات المتاحة
            </p>
          </div>
        </div>

        <LocaleLink href="/dashboard/add-card">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white px-6 py-3 rounded-xl font-semibold shadow-xl shadow-gray-200 transition-all text-sm md:text-base"
          >
            <FiPlus size={20} />
            إضافة بطاقة جديدة
          </motion.button>
        </LocaleLink>
      </div>

      <div className="max-w-[1920px] mx-auto flex flex-col lg:flex-row gap-8 items-start relative">
        {/* Sidebar */}
        <aside className="w-full lg:w-80 shrink-0 z-10">
          <CardsFilterSidebar onFilterChange={handleFilterChange} />
        </aside>

        {/* Main Content */}
        <main className="flex-1 w-full min-w-0">
          {loading ? (
            <div className="flex flex-col justify-center items-center h-96 bg-white rounded-3xl shadow-sm border border-gray-100/50">
              <LoadingSpin />
              <p className="mt-4 text-gray-400 text-sm animate-pulse">
                جاري تحميل البطاقات...
              </p>
            </div>
          ) : (
            <>
              <div className="mb-4 text-gray-500 text-sm font-medium">
                تم العثور على {cards?.length || 0} بطاقة
              </div>

              {cards && cards.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
                  {cards.map((card) => (
                    <CardDashDisplay
                      setCards={setCards}
                      key={card.id}
                      card={card}
                    />
                  ))}
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center justify-center py-32 bg-white rounded-3xl shadow-sm border border-gray-100 text-center px-4"
                >
                  <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                    <FiAlertCircle className="text-gray-300" size={40} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    لا توجد بطاقات مطابقة
                  </h3>
                  <p className="text-gray-500 max-w-sm mx-auto leading-relaxed">
                    لم يتم العثور على أي نتائج تطابق عملية البحث الحالية. حاول
                    تعديل خيارات التصفية أو البحث عن اسم آخر.
                  </p>
                  <button
                    onClick={() => handleFilterChange({})}
                    className="mt-6 text-blue-600 hover:text-blue-700 font-medium hover:underline"
                  >
                    مسح جميع الفلاتر
                  </button>
                </motion.div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
