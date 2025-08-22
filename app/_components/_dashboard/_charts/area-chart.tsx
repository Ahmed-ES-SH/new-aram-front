"use client";

import { motion } from "framer-motion";
import { useState } from "react";

const data = [
  { month: "Jan", revenue: 180000, bookings: 1200 },
  { month: "Feb", revenue: 195000, bookings: 1350 },
  { month: "Mar", revenue: 210000, bookings: 1450 },
  { month: "Apr", revenue: 225000, bookings: 1600 },
  { month: "May", revenue: 240000, bookings: 1750 },
  { month: "Jun", revenue: 255000, bookings: 1900 },
  { month: "Jul", revenue: 270000, bookings: 2050 },
  { month: "Aug", revenue: 285000, bookings: 2200 },
  { month: "Sep", revenue: 300000, bookings: 2350 },
  { month: "Oct", revenue: 315000, bookings: 2500 },
  { month: "Nov", revenue: 330000, bookings: 2650 },
  { month: "Dec", revenue: 345000, bookings: 2800 },
];

export function AreaChart() {
  const [activeMetric, setActiveMetric] = useState<"revenue" | "bookings">(
    "revenue"
  );

  const maxRevenue = Math.max(...data.map((d) => d.revenue));
  const maxBookings = Math.max(...data.map((d) => d.bookings));

  const getYValue = (value: number, isBookings: boolean) => {
    const max = isBookings ? maxBookings : maxRevenue;
    return 180 - (value / max) * 140;
  };

  const createPath = (metric: "revenue" | "bookings") => {
    const points = data
      .map((d, i) => {
        const x = 80 + i * 60;
        const y = getYValue(d[metric], metric === "bookings");
        return `${x},${y}`;
      })
      .join(" ");

    const firstX = 80;
    const lastX = 80 + (data.length - 1) * 60;
    return `M ${firstX},180 L ${points} L ${lastX},180 Z`;
  };

  return (
    <div className="min-h-80 relative">
      {/* Toggle buttons */}
      <div className="flex space-x-2 mb-4">
        <button
          onClick={() => setActiveMetric("revenue")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeMetric === "revenue"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          Revenue
        </button>
        <button
          onClick={() => setActiveMetric("bookings")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeMetric === "bookings"
              ? "bg-green-600 text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          Bookings
        </button>
      </div>

      <svg className="w-full h-full" viewBox="0 0 800 200">
        {/* Grid lines */}
        {[0, 1, 2, 3, 4].map((i) => (
          <line
            key={i}
            x1="70"
            y1={40 + i * 35}
            x2="750"
            y2={40 + i * 35}
            stroke="#f3f4f6"
            strokeWidth="1"
          />
        ))}

        {/* Y-axis labels */}
        {[0, 1, 2, 3, 4].map((i) => {
          const max = activeMetric === "bookings" ? maxBookings : maxRevenue;
          const value = max - (i * max) / 4;
          const label =
            activeMetric === "bookings"
              ? Math.round(value).toLocaleString()
              : `$${Math.round(value / 1000)}k`;

          return (
            <text
              key={i}
              x="60"
              y={45 + i * 35}
              textAnchor="end"
              className="text-xs fill-gray-500"
            >
              {label}
            </text>
          );
        })}

        {/* Area fill */}
        <motion.path
          key={activeMetric}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          transition={{ duration: 0.5 }}
          d={createPath(activeMetric)}
          fill={activeMetric === "revenue" ? "#3b82f6" : "#10b981"}
        />

        {/* Line */}
        <motion.path
          key={`line-${activeMetric}`}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, delay: 0.2 }}
          d={`M ${data
            .map(
              (d, i) =>
                `${80 + i * 60} ${getYValue(
                  d[activeMetric],
                  activeMetric === "bookings"
                )}`
            )
            .join(" L ")}`}
          fill="none"
          stroke={activeMetric === "revenue" ? "#3b82f6" : "#10b981"}
          strokeWidth="3"
          strokeLinecap="round"
        />

        {/* Data points */}
        {data.map((d, i) => (
          <motion.circle
            key={`${activeMetric}-${i}`}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3, delay: 0.5 + i * 0.05 }}
            cx={80 + i * 60}
            cy={getYValue(d[activeMetric], activeMetric === "bookings")}
            r="4"
            fill={activeMetric === "revenue" ? "#3b82f6" : "#10b981"}
            className="hover:r-6 transition-all cursor-pointer"
          />
        ))}

        {/* X-axis labels */}
        {data.map((d, i) => (
          <text
            key={i}
            x={80 + i * 60}
            y="195"
            textAnchor="middle"
            className="text-xs fill-gray-500"
          >
            {d.month}
          </text>
        ))}
      </svg>
    </div>
  );
}
