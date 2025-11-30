"use client";

import { motion } from "framer-motion";
import { FiTrendingUp, FiAward, FiUserCheck } from "react-icons/fi";
import { LineChart, Line, ResponsiveContainer } from "recharts";
import { Promoter } from "./types";

// Sample promoters data
const promotersData: Promoter[] = [
  {
    id: "1",
    name: "خالد السالم",
    sales: 125000,
    avatar: "/professional-arab-man-avatar.jpg",
    trend: [20, 35, 45, 60, 75, 90, 125],
  },
  {
    id: "2",
    name: "نورة الفهد",
    sales: 98500,
    avatar: "/professional-arab-woman-avatar.jpg",
    trend: [15, 25, 40, 55, 70, 85, 98],
  },
  {
    id: "3",
    name: "فيصل العمري",
    sales: 87200,
    avatar: "/arab-businessman-avatar.png",
    trend: [10, 20, 35, 50, 65, 78, 87],
  },
];

// Mini sparkline chart component
function SparklineChart({ data, color }: { data: number[]; color: string }) {
  const chartData = data.map((value, index) => ({ value, index }));

  return (
    <div className="h-10 w-24" dir="ltr">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <Line
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

// Single promoter card component
function PromoterCard({
  promoter,
  rank,
  index,
}: {
  promoter: Promoter;
  rank: number;
  index: number;
}) {
  const colors = ["#f59e0b", "#94a3b8", "#cd7c32"];
  const rankColor = colors[rank - 1] || "#64748b";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ scale: 1.02 }}
      className="flex items-center gap-4 rounded-xl bg-gray-50 p-4 transition-all hover:bg-gray-100"
    >
      {/* Rank badge */}
      <div
        className="flex h-8 w-8 items-center justify-center rounded-full text-white text-sm font-bold"
        style={{ backgroundColor: rankColor }}
      >
        {rank}
      </div>

      {/* Avatar */}
      <img
        src={promoter.avatar || "/placeholder.svg"}
        alt={promoter.name}
        className="h-12 w-12 rounded-full object-cover border-2 border-white shadow-sm"
      />

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-gray-900 truncate">{promoter.name}</p>
        <p className="text-sm text-green-600 font-medium">
          {promoter.sales.toLocaleString("ar-SA")} ريال
        </p>
      </div>

      {/* Sparkline */}
      <SparklineChart data={promoter.trend} color="#10b981" />
    </motion.div>
  );
}

// Promoters overview section component
export function PromotersOverview() {
  const totalPromoters = 186;
  const totalSales = promotersData.reduce((acc, p) => acc + p.sales, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100 h-full"
    >
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100">
            <FiUserCheck className="h-5 w-5 text-indigo-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">نظام المسوقين</h3>
            <p className="text-sm text-gray-500">{totalPromoters} مسوق نشط</p>
          </div>
        </div>
        <div className="text-left">
          <p className="text-xs text-gray-500">إجمالي المبيعات</p>
          <p className="text-lg font-bold text-green-600">
            {totalSales.toLocaleString("ar-SA")} ريال
          </p>
        </div>
      </div>

      {/* Top 3 promoters */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-4">
          <FiAward className="h-5 w-5 text-amber-500" />
          <h4 className="font-semibold text-gray-900">أفضل المسوقين</h4>
        </div>
        <div className="space-y-3">
          {promotersData.map((promoter, index) => (
            <PromoterCard
              key={promoter.id}
              promoter={promoter}
              rank={index + 1}
              index={index}
            />
          ))}
        </div>
      </div>

      {/* View all link */}
      <button className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-50 py-3 text-sm font-medium text-indigo-600 transition-colors hover:bg-indigo-100">
        <FiTrendingUp className="h-4 w-4" />
        عرض جميع المسوقين
      </button>
    </motion.div>
  );
}
