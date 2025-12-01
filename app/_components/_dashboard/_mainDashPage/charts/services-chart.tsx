"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { ServicesChartData } from "../types";

// Colors for bars
const barColors = [
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#ec4899",
];

// Custom tooltip component
function CustomTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg bg-white p-4 shadow-lg border border-gray-200">
        <p className="font-bold text-gray-900">{label}</p>
        <p className="text-green-600">
          الاستخدام: {payload[0].value.toLocaleString("ar-SA")}
        </p>
      </div>
    );
  }
  return null;
}

interface props {
  servicesData: ServicesChartData[];
}

// Services bar chart component
export function ServicesChart({ servicesData }: props) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100 h-full">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-900">استخدام الخدمات</h3>
        <p className="text-sm text-gray-500">
          أكثر الخدمات استخداماً في المنصة
        </p>
      </div>

      <div className="h-72 w-full" dir="ltr">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={servicesData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis
              type="number"
              tick={{ fill: "#64748b", fontSize: 12 }}
              axisLine={{ stroke: "#e2e8f0" }}
            />
            <YAxis
              type="category"
              dataKey="service"
              width={100}
              tick={{ fill: "#64748b", fontSize: 12 }}
              axisLine={{ stroke: "#e2e8f0" }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="usage" radius={[0, 8, 8, 0]}>
              {servicesData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={barColors[index % barColors.length]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
