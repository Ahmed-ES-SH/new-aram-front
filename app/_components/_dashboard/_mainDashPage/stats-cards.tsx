"use client";

import { motion } from "framer-motion";
import {
  FiUsers,
  FiMapPin,
  FiGift,
  FiTag,
  FiGrid,
  FiMail,
  FiBell,
  FiUserCheck,
} from "react-icons/fi";
import { StatCard } from "./types";

// Statistics cards data
const statsData: StatCard[] = [
  {
    id: "users",
    title: "إجمالي المستخدمين",
    value: 12458,
    icon: <FiUsers className="h-6 w-6" />,
    bgColor: "bg-blue-50",
    iconColor: "text-blue-600",
  },
  {
    id: "centers",
    title: "إجمالي المراكز",
    value: 342,
    icon: <FiMapPin className="h-6 w-6" />,
    bgColor: "bg-green-50",
    iconColor: "text-green-600",
  },
  {
    id: "services",
    title: "إجمالي الخدمات",
    value: 856,
    icon: <FiGrid className="h-6 w-6" />,
    bgColor: "bg-orange-50",
    iconColor: "text-orange-600",
  },
  {
    id: "offers",
    title: "إجمالي العروض",
    value: 128,
    icon: <FiGift className="h-6 w-6" />,
    bgColor: "bg-purple-50",
    iconColor: "text-purple-600",
  },
  {
    id: "coupons",
    title: "إجمالي الكوبونات",
    value: 95,
    icon: <FiTag className="h-6 w-6" />,
    bgColor: "bg-pink-50",
    iconColor: "text-pink-600",
  },
  {
    id: "messages",
    title: "إجمالي الرسائل",
    value: 2847,
    icon: <FiMail className="h-6 w-6" />,
    bgColor: "bg-cyan-50",
    iconColor: "text-cyan-600",
  },
  {
    id: "notifications",
    title: "إجمالي الإشعارات",
    value: 5621,
    icon: <FiBell className="h-6 w-6" />,
    bgColor: "bg-yellow-50",
    iconColor: "text-yellow-600",
  },
  {
    id: "promoters",
    title: "إجمالي المسوقين",
    value: 186,
    icon: <FiUserCheck className="h-6 w-6" />,
    bgColor: "bg-red-50",
    iconColor: "text-red-600",
  },
];

// Single stat card component
function StatCardItem({ stat, index }: { stat: StatCard; index: number }) {
  const formattedValue = stat.value.toLocaleString("ar-SA");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ scale: 1.03, boxShadow: "0 10px 40px rgba(0,0,0,0.1)" }}
      className="group cursor-pointer rounded-2xl bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-lg border border-gray-100"
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-500">{stat.title}</p>
          <motion.p
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.05 + 0.2 }}
            className="mt-2 text-3xl font-bold text-gray-900"
          >
            {formattedValue}
          </motion.p>
        </div>
        <motion.div
          whileHover={{ rotate: 10 }}
          className={`flex h-14 w-14 items-center justify-center rounded-2xl ${stat.bgColor} ${stat.iconColor} transition-transform`}
        >
          {stat.icon}
        </motion.div>
      </div>
    </motion.div>
  );
}

// Main stats cards grid component
export function StatsCards() {
  return (
    <section className="mt-8">
      <motion.h2
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="mb-6 text-xl font-bold text-gray-900"
      >
        الإحصائيات الرئيسية
      </motion.h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statsData.map((stat, index) => (
          <StatCardItem key={stat.id} stat={stat} index={index} />
        ))}
      </div>
    </section>
  );
}
