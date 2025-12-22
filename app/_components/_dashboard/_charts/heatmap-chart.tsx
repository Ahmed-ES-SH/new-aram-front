"use client"

import { motion } from "framer-motion"

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
const hours = ["6AM", "9AM", "12PM", "3PM", "6PM", "9PM"]

const heatmapData = [
  [20, 35, 45, 60, 80, 40],
  [25, 40, 55, 70, 85, 45],
  [30, 45, 60, 75, 90, 50],
  [35, 50, 65, 80, 95, 55],
  [40, 55, 70, 85, 100, 60],
  [45, 60, 75, 90, 85, 65],
  [25, 40, 50, 65, 70, 35],
]

export function HeatmapChart() {
  const getColor = (value: number) => {
    const intensity = value / 100
    if (intensity < 0.2) return "#f3f4f6"
    if (intensity < 0.4) return "#ddd6fe"
    if (intensity < 0.6) return "#c4b5fd"
    if (intensity < 0.8) return "#a78bfa"
    return "#8b5cf6"
  }

  return (
    <div className="h-64">
      <div className="grid grid-cols-7 gap-1 mb-2">
        {days.map((day) => (
          <div key={day} className="text-xs text-gray-500 text-center font-medium">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {heatmapData.map((dayData, dayIndex) => (
          <div key={dayIndex} className="space-y-1">
            {dayData.map((value, hourIndex) => (
              <motion.div
                key={`${dayIndex}-${hourIndex}`}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3, delay: (dayIndex * 6 + hourIndex) * 0.02 }}
                className="w-8 h-8 rounded cursor-pointer hover:scale-110 transition-transform relative group"
                style={{ backgroundColor: getColor(value) }}
              >
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                  {days[dayIndex]} {hours[hourIndex]}: {value}%
                </div>
              </motion.div>
            ))}
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between mt-4 text-xs text-gray-500">
        <span>Less</span>
        <div className="flex space-x-1">
          {[0.1, 0.3, 0.5, 0.7, 0.9].map((intensity, i) => (
            <div key={i} className="w-3 h-3 rounded" style={{ backgroundColor: getColor(intensity * 100) }} />
          ))}
        </div>
        <span>More</span>
      </div>
    </div>
  )
}
