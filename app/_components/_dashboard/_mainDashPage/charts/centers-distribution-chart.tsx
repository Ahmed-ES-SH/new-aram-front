"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { CenterDistribution } from "../types";

// Sample data for centers distribution
const centersData: CenterDistribution[] = [
  { name: "الرياض", value: 120, color: "#3b82f6" },
  { name: "جدة", value: 85, color: "#10b981" },
  { name: "الدمام", value: 55, color: "#f59e0b" },
  { name: "مكة", value: 42, color: "#ef4444" },
  { name: "المدينة", value: 25, color: "#8b5cf6" },
  { name: "أخرى", value: 15, color: "#64748b" },
];

// Custom tooltip component
function CustomTooltip({ active, payload }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg bg-white p-4 shadow-lg border border-gray-200">
        <p className="font-bold text-gray-900">{payload[0].name}</p>
        <p style={{ color: payload[0].payload.color }}>
          عدد المراكز: {payload[0].value.toLocaleString("ar-SA")}
        </p>
      </div>
    );
  }
  return null;
}

interface props {
  centersData: CenterDistribution[];
}

// Centers distribution pie chart component
export function CentersDistributionChart({ centersData }: props) {
  const totalCenters = centersData.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100 h-full">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-900">توزيع المراكز</h3>
        <p className="text-sm text-gray-500">توزيع المراكز حسب المدن</p>
      </div>

      <div className="flex flex-col lg:flex-row items-center gap-6">
        <div className="h-56 w-56" dir="ltr">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={centersData as any}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={4}
                dataKey="value"
              >
                {centersData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="flex-1 space-y-3">
          {centersData.map((item) => (
            <div
              key={item.name}
              className="flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-2">
                <div
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm text-gray-700">{item.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-gray-900">
                  {item.value}
                </span>
                <span className="text-xs text-gray-500">
                  ({Math.round((item.value / totalCenters) * 100)}%)
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
