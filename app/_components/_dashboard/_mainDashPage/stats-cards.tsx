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
import { useEffect, useState } from "react";

interface state {
  usersCount: number;
  organizationsCount: number;
  promotersCount: number;
  servicesCount: number;
  offersCount: number;
  couponsCount: number;
}

interface Props {
  statsData: state;
}

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
export function StatsCards({ statsData: data }: Props) {
  const [statsCards, setStatsCards] = useState<StatCard[]>([
    {
      id: "usersCount",
      title: "إجمالي المستخدمين",
      value: 0,
      icon: <FiUsers className="h-6 w-6" />,
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      id: "organizationsCount",
      title: "إجمالي المراكز",
      value: 0,
      icon: <FiMapPin className="h-6 w-6" />,
      bgColor: "bg-green-50",
      iconColor: "text-green-600",
    },
    {
      id: "servicesCount",
      title: "إجمالي الخدمات",
      value: 0,
      icon: <FiGrid className="h-6 w-6" />,
      bgColor: "bg-orange-50",
      iconColor: "text-orange-600",
    },
    {
      id: "offersCount",
      title: "إجمالي العروض",
      value: 0,
      icon: <FiGift className="h-6 w-6" />,
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600",
    },
    {
      id: "couponsCount",
      title: "إجمالي الكوبونات",
      value: 0,
      icon: <FiTag className="h-6 w-6" />,
      bgColor: "bg-pink-50",
      iconColor: "text-pink-600",
    },
    {
      id: "promotersCount",
      title: "إجمالي المسوقين",
      value: 0,
      icon: <FiUserCheck className="h-6 w-6" />,
      bgColor: "bg-red-50",
      iconColor: "text-red-600",
    },
  ]);

  useEffect(() => {
    if (data) {
      setStatsCards((prev) => {
        return prev.map((stat) => {
          if (stat.id === "usersCount") {
            return { ...stat, value: data.usersCount };
          } else if (stat.id === "organizationsCount") {
            return { ...stat, value: data.organizationsCount };
          } else if (stat.id === "servicesCount") {
            return { ...stat, value: data.servicesCount };
          } else if (stat.id === "offersCount") {
            return { ...stat, value: data.offersCount };
          } else if (stat.id === "couponsCount") {
            return { ...stat, value: data.couponsCount };
          } else if (stat.id === "promotersCount") {
            return { ...stat, value: data.promotersCount };
          }
          return stat;
        });
      });
    }
  }, [data]);

  return (
    <section className="mt-8">
      <motion.h2
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="mb-6 text-xl font-bold text-gray-900"
      >
        الإحصائيات الرئيسية
      </motion.h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {statsCards.map((stat, index) => (
          <StatCardItem key={stat.id} stat={stat} index={index} />
        ))}
      </div>
    </section>
  );
}
