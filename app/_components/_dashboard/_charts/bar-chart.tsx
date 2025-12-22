"use client"

import { motion } from "framer-motion"

const data = [
  { name: "Downtown Fitness", bookings: 1247 },
  { name: "Wellness Hub", bookings: 1156 },
  { name: "Health Center Pro", bookings: 1089 },
  { name: "Fit Zone Plus", bookings: 987 },
  { name: "Active Life Center", bookings: 876 },
]

export function BarChart() {
  const maxBookings = Math.max(...data.map((d) => d.bookings))

  return (
    <div className="h-64 space-y-4">
      {data.map((item, index) => (
        <div key={item.name} className="flex items-center space-x-4">
          <div className="w-32 text-sm text-gray-600 truncate">{item.name}</div>
          <div className="flex-1 bg-gray-200 rounded-full h-8 relative overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(item.bookings / maxBookings) * 100}%` }}
              transition={{ duration: 1, delay: index * 0.2 }}
              className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-end pr-3"
            >
              <span className="text-white text-sm font-medium">{item.bookings}</span>
            </motion.div>
          </div>
        </div>
      ))}
    </div>
  )
}
