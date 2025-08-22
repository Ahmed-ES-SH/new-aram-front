"use client"

import { motion } from "framer-motion"

const data = [
  { month: "Jan", revenue: 180000 },
  { month: "Feb", revenue: 195000 },
  { month: "Mar", revenue: 210000 },
  { month: "Apr", revenue: 225000 },
  { month: "May", revenue: 240000 },
  { month: "Jun", revenue: 255000 },
  { month: "Jul", revenue: 270000 },
  { month: "Aug", revenue: 285000 },
  { month: "Sep", revenue: 300000 },
  { month: "Oct", revenue: 315000 },
  { month: "Nov", revenue: 330000 },
  { month: "Dec", revenue: 345000 },
]

export function LineChart() {
  const maxRevenue = Math.max(...data.map((d) => d.revenue))

  return (
    <div className="h-64 relative">
      <svg className="w-full h-full" viewBox="0 0 800 200">
        {/* Grid lines */}
        {[0, 1, 2, 3, 4].map((i) => (
          <line key={i} x1="60" y1={40 + i * 32} x2="760" y2={40 + i * 32} stroke="#f3f4f6" strokeWidth="1" />
        ))}

        {/* Y-axis labels */}
        {[0, 1, 2, 3, 4].map((i) => (
          <text key={i} x="50" y={45 + i * 32} textAnchor="end" className="text-xs fill-gray-500">
            ${Math.round((maxRevenue - (i * maxRevenue) / 4) / 1000)}k
          </text>
        ))}

        {/* Line path */}
        <motion.path
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, delay: 0.5 }}
          d={`M ${data.map((d, i) => `${60 + i * 58.33} ${168 - (d.revenue / maxRevenue) * 128}`).join(" L ")}`}
          fill="none"
          stroke="#3b82f6"
          strokeWidth="3"
          strokeLinecap="round"
        />

        {/* Data points */}
        {data.map((d, i) => (
          <motion.circle
            key={i}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3, delay: 0.5 + i * 0.1 }}
            cx={60 + i * 58.33}
            cy={168 - (d.revenue / maxRevenue) * 128}
            r="4"
            fill="#3b82f6"
            className="hover:r-6 transition-all cursor-pointer"
          />
        ))}

        {/* X-axis labels */}
        {data.map((d, i) => (
          <text key={i} x={60 + i * 58.33} y="190" textAnchor="middle" className="text-xs fill-gray-500">
            {d.month}
          </text>
        ))}
      </svg>
    </div>
  )
}
