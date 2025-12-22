"use client";

import { motion } from "framer-motion";

const data = [
  { label: "Downtown Fitness", value: 485000, color: "#3b82f6" },
  { label: "Wellness Hub", value: 420000, color: "#10b981" },
  { label: "Health Center Pro", value: 380000, color: "#f59e0b" },
  { label: "Fit Zone Plus", value: 320000, color: "#ef4444" },
  { label: "Others", value: 1242392, color: "#8b5cf6" },
];

export function DonutChart() {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  let cumulativePercentage = 0;

  return (
    <div className="flex items-center justify-center h-64">
      <div className="relative">
        <svg width="200" height="200" className="transform -rotate-90">
          {data.map((item, index) => {
            const percentage = (item.value / total) * 100;
            const strokeDasharray = `${percentage * 1.88} 188`;
            const strokeDashoffset = -cumulativePercentage * 1.88;
            cumulativePercentage += percentage;

            return (
              <motion.circle
                key={index}
                cx="100"
                cy="100"
                r="80"
                fill="transparent"
                stroke={item.color}
                strokeWidth="20"
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                initial={{ strokeDasharray: "0 502" }}
                animate={{ strokeDasharray }}
                transition={{ duration: 1, delay: index * 0.2 }}
              />
            );
          })}
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-lg font-bold text-gray-900">$2.8M</div>
            <div className="text-xs text-gray-500">Total</div>
          </div>
        </div>
      </div>
      <div className="ml-6 space-y-1">
        {data.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="flex items-center space-x-2"
          >
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-xs text-gray-600 truncate max-w-24">
              {item.label}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
