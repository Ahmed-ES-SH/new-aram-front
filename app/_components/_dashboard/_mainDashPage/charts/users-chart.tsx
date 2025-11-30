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
import { UserChartData } from "../types";

// Sample data for users over last 12 months
const usersData: UserChartData[] = [
  { month: "يناير", users: 1200 },
  { month: "فبراير", users: 1450 },
  { month: "مارس", users: 1680 },
  { month: "أبريل", users: 1920 },
  { month: "مايو", users: 2150 },
  { month: "يونيو", users: 2480 },
  { month: "يوليو", users: 2750 },
  { month: "أغسطس", users: 3100 },
  { month: "سبتمبر", users: 3450 },
  { month: "أكتوبر", users: 3820 },
  { month: "نوفمبر", users: 4200 },
  { month: "ديسمبر", users: 4580 },
];

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

// Users line chart component
export function UsersChart() {
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
          <span className="text-sm font-semibold text-blue-600">+282%</span>
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
