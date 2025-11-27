"use client";

import React from "react";
import { motion } from "framer-motion";
import { FaUsers, FaShoppingCart, FaDollarSign, FaChartLine } from "react-icons/fa";

interface KPI {
  id: number;
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  icon: React.ReactNode;
  color: string;
}

const kpiData: KPI[] = [
  {
    id: 1,
    title: "Total Revenue",
    value: "$45,231.89",
    change: "+20.1% from last month",
    isPositive: true,
    icon: <FaDollarSign className="text-2xl text-white" />,
    color: "bg-emerald-500",
  },
  {
    id: 2,
    title: "Active Users",
    value: "+2350",
    change: "+180.1% from last month",
    isPositive: true,
    icon: <FaUsers className="text-2xl text-white" />,
    color: "bg-blue-500",
  },
  {
    id: 3,
    title: "New Orders",
    value: "+12,234",
    change: "+19% from last month",
    isPositive: true,
    icon: <FaShoppingCart className="text-2xl text-white" />,
    color: "bg-orange-500",
  },
  {
    id: 4,
    title: "Growth Rate",
    value: "+12.5%",
    change: "+4% from last month",
    isPositive: true,
    icon: <FaChartLine className="text-2xl text-white" />,
    color: "bg-purple-500",
  },
];

const KPICards = () => {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      {kpiData.map((kpi, index) => (
        <motion.div
          key={kpi.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                {kpi.title}
              </p>
              <h3 className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
                {kpi.value}
              </h3>
            </div>
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-lg ${kpi.color} shadow-md`}
            >
              {kpi.icon}
            </div>
          </div>
          <div className="mt-4">
            <p
              className={`text-xs font-medium ${
                kpi.isPositive ? "text-emerald-600" : "text-red-600"
              }`}
            >
              {kpi.change}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default KPICards;
