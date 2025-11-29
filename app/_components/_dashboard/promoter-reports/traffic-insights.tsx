"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { FiGlobe, FiMonitor, FiHash } from "react-icons/fi";
import { PromotionActivity } from "./types";

interface TrafficInsightsProps {
  activities: PromotionActivity[];
}

const COLORS = [
  "#3b82f6",
  "#22c55e",
  "#f59e0b",
  "#a855f7",
  "#ec4899",
  "#06b6d4",
];

export default function TrafficInsights({ activities }: TrafficInsightsProps) {
  const countryStats = useMemo(() => {
    const counts: Record<string, number> = {};
    activities
      .filter((a) => a.activity_type === "visit")
      .forEach((a) => {
        counts[a.country] = (counts[a.country] || 0) + 1;
      });
    return Object.entries(counts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
  }, [activities]);

  const deviceStats = useMemo(() => {
    const counts: Record<string, number> = {};
    activities
      .filter((a) => a.activity_type === "visit")
      .forEach((a) => {
        counts[a.device_type] = (counts[a.device_type] || 0) + 1;
      });
    return Object.entries(counts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [activities]);

  const ipStats = useMemo(() => {
    const counts: Record<string, number> = {};
    activities
      .filter((a) => a.activity_type === "visit")
      .forEach((a) => {
        counts[a.ip_address] = (counts[a.ip_address] || 0) + 1;
      });
    return Object.entries(counts)
      .map(([ip, count]) => ({ ip, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [activities]);

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="space-y-4"
    >
      <h2 className="text-xl font-bold text-foreground">تحليل جودة الزيارات</h2>

      <div className="space-y-4">
        {/* Top Countries */}
        <div className="bg-card rounded-xl border border-border p-5">
          <div className="flex items-center gap-2 mb-4">
            <FiGlobe className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-foreground">أكثر الدول زيارة</h3>
          </div>
          <div className="flex items-center gap-6">
            <div className="w-32 h-32">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={countryStats}
                    cx="50%"
                    cy="50%"
                    innerRadius={25}
                    outerRadius={50}
                    dataKey="value"
                    stroke="none"
                  >
                    {countryStats.map((_, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex-1 space-y-2">
              {countryStats.map((item, index) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="text-sm text-foreground">{item.name}</span>
                  </div>
                  <span className="text-sm font-medium text-foreground">
                    {item.value.toLocaleString("ar-EG")}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Devices */}
        <div className="bg-card rounded-xl border border-border p-5">
          <div className="flex items-center gap-2 mb-4">
            <FiMonitor className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-foreground">
              أكثر الأجهزة استخدامًا
            </h3>
          </div>
          <div className="space-y-3">
            {deviceStats.map((item, index) => {
              const total = deviceStats.reduce((sum, d) => sum + d.value, 0);
              const percentage = (item.value / total) * 100;
              return (
                <div key={item.name}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-foreground">{item.name}</span>
                    <span className="text-sm font-medium text-foreground">
                      {item.value.toLocaleString("ar-EG")} (
                      {percentage.toFixed(0)}%)
                    </span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top IPs */}
        <div className="bg-card rounded-xl border border-border p-5">
          <div className="flex items-center gap-2 mb-4">
            <FiHash className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-foreground">أكثر IPs تكرارًا</h3>
          </div>
          <div className="space-y-2">
            {ipStats.map((item, index) => (
              <div
                key={item.ip}
                className="flex items-center justify-between p-2 rounded-lg bg-gray-200"
              >
                <span className="text-sm font-mono text-muted-foreground">
                  {item.ip}
                </span>
                <span className="text-sm font-medium text-green-500">
                  {item.count.toLocaleString("ar-EG")} زيارة
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.section>
  );
}
