"use client";

import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import { UsageItem } from "../charts-section";

// Custom tooltip component
function CustomTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg bg-white p-4 shadow-lg border border-gray-200">
        <p className="font-bold text-gray-900">{label}</p>
        <p className="text-blue-600">
          المستخدمين: {payload[0].value.toLocaleString("ar-SA")}
        </p>
      </div>
    );
  }
  return null;
}

interface props {
  usersData: UsageItem[];
}

// Users line chart component
export function UsersChart({ usersData }: props) {
  // Extract last two months
  const lastMonth = usersData[usersData.length - 1]?.usage ?? 0;
  const prevMonth = usersData[usersData.length - 2]?.usage ?? 0;

  // Calculate growth percentage
  const growthPercent =
    prevMonth === 0 ? 100 : ((lastMonth - prevMonth) / prevMonth) * 100;

  // Round to whole number
  const formattedPercent = Math.round(growthPercent);

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-gray-900">نمو المستخدمين</h3>
          <p className="text-sm text-gray-500">
            إحصائيات المستخدمين خلال آخر 12 شهر
          </p>
        </div>
        <div className="rounded-lg bg-blue-50 px-3 py-1.5">
          <span className="text-sm font-semibold text-blue-600">
            {formattedPercent > 0 ? "+" : ""}
            {formattedPercent}%
          </span>
        </div>
      </div>

      <div className="h-80 w-full" dir="ltr">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={usersData}>
            <defs>
              <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis
              dataKey="month"
              tick={{ fill: "#64748b", fontSize: 12 }}
              axisLine={{ stroke: "#e2e8f0" }}
            />
            <YAxis
              tick={{ fill: "#64748b", fontSize: 12 }}
              axisLine={{ stroke: "#e2e8f0" }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="users"
              stroke="#3b82f6"
              strokeWidth={3}
              fill="url(#colorUsers)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
