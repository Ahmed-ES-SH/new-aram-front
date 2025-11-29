"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import {
  FiEye,
  FiUserPlus,
  FiShoppingCart,
  FiDollarSign,
} from "react-icons/fi";
import { PromotionActivity } from "./types";

interface ChartsSectionProps {
  activities: PromotionActivity[];
}

type ChartType = "visits" | "registrations" | "purchases" | "earnings";

export default function ChartsSection({ activities }: ChartsSectionProps) {
  const [activeChart, setActiveChart] = useState<ChartType>("visits");

  // ==========================================
  // FORMAT DATE COMING FROM LARAVEL
  // Example: 2025-11-28T12:24:07.000000Z
  // Output: "2025/11/28"
  // ==========================================
  const formatDate = (iso: string) => {
    const dateObj = new Date(iso);

    // تنسيق التاريخ العربي بالشكل المطلوب
    return dateObj.toLocaleDateString("ar-EG", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  // Group activities by formatted date
  const groupedData = activities.reduce((acc, activity) => {
    const date = formatDate(activity.created_at);

    if (!acc[date]) {
      acc[date] = {
        date,
        visits: 0,
        registrations: 0,
        purchases: 0,
        earnings: 0,
      };
    }

    if (activity.activity_type === "visit") acc[date].visits++;
    if (activity.activity_type === "signup") acc[date].registrations++;
    if (activity.activity_type === "purchase") {
      acc[date].purchases++;
      acc[date].earnings += activity.commission_amount || 0;
    }

    return acc;
  }, {} as Record<string, { date: string; visits: number; registrations: number; purchases: number; earnings: number }>);

  const chartData = Object.values(groupedData).slice(-14);

  const chartConfigs = {
    visits: {
      title: "مخطط الزيارات عبر الزمن",
      dataKey: "visits",
      color: "#3b82f6",
      icon: FiEye,
    },
    registrations: {
      title: "مخطط التسجيلات عبر الزمن",
      dataKey: "registrations",
      color: "#22c55e",
      icon: FiUserPlus,
    },
    purchases: {
      title: "مخطط المشتريات عبر الزمن",
      dataKey: "purchases",
      color: "#a855f7",
      icon: FiShoppingCart,
    },
    earnings: {
      title: "مخطط الأرباح عبر الزمن",
      dataKey: "earnings",
      color: "#f59e0b",
      icon: FiDollarSign,
    },
  };

  const config = chartConfigs[activeChart];

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="space-y-4"
    >
      <h2 className="text-xl font-bold text-foreground">قسم الرسوم البيانية</h2>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2">
        {(Object.keys(chartConfigs) as ChartType[]).map((type) => {
          const cfg = chartConfigs[type];
          return (
            <button
              key={type}
              onClick={() => setActiveChart(type)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                activeChart === type
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "bg-card text-foreground border border-border hover:bg-primary hover:text-white"
              }`}
            >
              <cfg.icon className="w-4 h-4" />
              {cfg.title.split(" ")[1]}
            </button>
          );
        })}
      </div>

      {/* Chart */}
      <div className="bg-card rounded-xl border border-border p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          {config.title}
        </h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient
                  id={`gradient-${activeChart}`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor={config.color}
                    stopOpacity={0.3}
                  />
                  <stop offset="95%" stopColor={config.color} stopOpacity={0} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="date" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} />

              <Tooltip
                contentStyle={{
                  backgroundColor: "#ffffff",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                  direction: "rtl",
                }}
              />

              <Area
                type="monotone"
                dataKey={config.dataKey}
                stroke={config.color}
                strokeWidth={2}
                fill={`url(#gradient-${activeChart})`}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </motion.section>
  );
}
