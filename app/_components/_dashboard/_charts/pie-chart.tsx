"use client";

import { motion } from "framer-motion";

const data = [
  { label: "Active", value: 231, color: "#10b981" },
  { label: "Inactive", value: 16, color: "#ef4444" },
];

export function PieChart() {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  let cumulativePercentage = 0;

  return (
    <div className="flex items-center justify-center h-64">
      <div className="relative">
        <svg width="300" height="300" className="transform -rotate-90">
          {data.map((item, index) => {
            const percentage = (item.value / total) * 100;
            const strokeDasharray = `${percentage * 2.51} 251.2`;
            const strokeDashoffset = -cumulativePercentage * 2.51;
            cumulativePercentage += percentage;

            return (
              <motion.circle
                key={index}
                cx="150"
                cy="150"
                r="80"
                fill="transparent"
                stroke={item.color}
                strokeWidth="25"
                strokeDasharray={strokeDasharray} // لازم تكون متحسبه باستخدام circumference
                strokeDashoffset={strokeDashoffset}
                initial={{ strokeDasharray: `0 ${2 * Math.PI * 80}` }}
                animate={{ strokeDasharray }}
                transition={{ duration: 1, delay: index * 0.5 }}
              />
            );
          })}
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{total}</div>
            <div className="text-sm text-gray-500">Centers</div>
          </div>
        </div>
      </div>
      <div className="ml-8 space-y-2">
        {data.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
            className="flex items-center space-x-2"
          >
            <div
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-sm text-gray-600">
              {item.label}: {item.value} (
              {((item.value / total) * 100).toFixed(1)}%)
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
