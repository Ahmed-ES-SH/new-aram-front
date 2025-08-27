"use client";

import type React from "react";
import { motion } from "framer-motion";
import {
  FiUsers,
  FiShoppingBag,
  FiDollarSign,
  FiTrendingUp,
} from "react-icons/fi";
import { BsFillBuildingFill } from "react-icons/bs";
import { StatItem } from "@/app/constants/_website/mockData";
import { directionMap } from "@/app/constants/_website/global";

interface StatsSectionProps {
  title: string;
  subtitle: string;
  stats: StatItem[];
  locale?: string;
}

export default function StatsSection({
  title,
  subtitle,
  stats,
  locale = "en",
}: StatsSectionProps) {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "users":
        return FiUsers;
      case "building":
        return BsFillBuildingFill;
      case "shopping-bag":
        return FiShoppingBag;
      case "dollar-sign":
        return FiDollarSign;
      default:
        return FiTrendingUp;
    }
  };

  return (
    <section
      dir={directionMap[locale]}
      className="py-16 px-4 c-container bg-gray-50"
    >
      <div className="">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className={`text-center mb-12 ${
            locale === "ar" ? "text-right" : "text-left"
          }`}
        >
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 text-balance">
            {title}
          </h2>
          <p className="text-xl text-gray-600 ltr:ml-6 rtl:mr-6 text-pretty">
            {subtitle}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => {
            const Icon = getIcon(stat.icon);
            return (
              <motion.div
                key={stat.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <div
                    className={`flex items-center gap-1 text-sm ${
                      stat.change >= 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    <FiTrendingUp
                      className={`w-4 h-4 ${
                        stat.change < 0 ? "rotate-180" : ""
                      }`}
                    />
                    <span className="font-medium">
                      {Math.abs(stat.change)}%
                    </span>
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">
                  {stat.value}
                </h3>
                <p className="text-gray-600 text-sm">{stat.title}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
