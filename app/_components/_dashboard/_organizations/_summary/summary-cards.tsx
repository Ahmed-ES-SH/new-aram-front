"use client"

import { motion } from "framer-motion"
import { FiHome, FiUsers, FiCalendar, FiDollarSign, FiStar, FiTrendingUp, FiActivity, FiTarget } from "react-icons/fi"

const summaryData = [
  {
    title: "Total Centers",
    value: "247",
    change: "+12 this month",
    icon: FiHome,
    color: "bg-blue-500",
    trend: "up",
  },
  {
    title: "Active Centers",
    value: "231",
    change: "93.5% active",
    icon: FiActivity,
    color: "bg-green-500",
    trend: "up",
  },
  {
    title: "Total Users",
    value: "45,892",
    change: "+2,341 this month",
    icon: FiUsers,
    color: "bg-purple-500",
    trend: "up",
  },
  {
    title: "Total Bookings",
    value: "12,847",
    change: "+8.2% vs last month",
    icon: FiCalendar,
    color: "bg-orange-500",
    trend: "up",
  },
  {
    title: "Total Revenue",
    value: "$2,847,392",
    change: "+15.3% vs last month",
    icon: FiDollarSign,
    color: "bg-emerald-500",
    trend: "up",
  },
  {
    title: "Avg Rating",
    value: "4.7",
    change: "94% satisfaction",
    icon: FiStar,
    color: "bg-yellow-500",
    trend: "up",
  },
  {
    title: "Success Rate",
    value: "87.3%",
    change: "+2.1% improvement",
    icon: FiTarget,
    color: "bg-indigo-500",
    trend: "up",
  },
  {
    title: "Growth Rate",
    value: "+23.4%",
    change: "YoY growth",
    icon: FiTrendingUp,
    color: "bg-pink-500",
    trend: "up",
  },
]

export function SummaryCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {summaryData.map((item, index) => (
        <motion.div
          key={item.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600">{item.title}</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{item.value}</p>
              <p className="text-sm text-green-600 mt-1 flex items-center">
                <FiTrendingUp className="w-3 h-3 mr-1" />
                {item.change}
              </p>
            </div>
            <div className={`${item.color} p-3 rounded-lg`}>
              <item.icon className="w-6 h-6 text-white" />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
