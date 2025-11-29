"use client";

import { motion } from "framer-motion";
import {
  FiEye,
  FiUserPlus,
  FiShoppingCart,
  FiDollarSign,
  FiTag,
  FiPercent,
  FiCheckCircle,
  FiXCircle,
} from "react-icons/fi";
import { Promoter } from "./types";

interface SummaryKPIsProps {
  promoter: Partial<Promoter>;
}

export default function SummaryKPIs({ promoter }: SummaryKPIsProps) {
  const kpis = [
    {
      title: "إجمالي الزيارات",
      value: promoter.total_signups,
      icon: FiEye,
      color: "bg-blue-500",
      bgColor: "bg-blue-50",
    },
    {
      title: "إجمالي التسجيلات",
      value: promoter.total_signups,
      icon: FiUserPlus,
      color: "bg-green-500",
      bgColor: "bg-green-50",
    },
    {
      title: "إجمالي المشتريات",
      value: promoter.total_purchases,
      icon: FiShoppingCart,
      color: "bg-purple-500",
      bgColor: "bg-purple-50",
    },
    {
      title: "إجمالي الأرباح",
      value: `${promoter.total_earnings} ر.ع`,
      icon: FiDollarSign,
      color: "bg-amber-500",
      bgColor: "bg-amber-50",
    },
    {
      title: "كود المروج",
      value: promoter.referral_code,
      icon: FiTag,
      color: "bg-cyan-500",
      bgColor: "bg-cyan-50",
    },
    {
      title: "نسبة الخصم",
      value: `${promoter.discount_percentage}%`,
      icon: FiPercent,
      color: "bg-pink-500",
      bgColor: "bg-pink-50",
    },

    {
      title: "حالة المروج",
      value: promoter.status == "active" ? "نشط" : "معطل",
      icon: promoter.status == "active" ? FiCheckCircle : FiXCircle,
      color: promoter.status == "active" ? "bg-green-500" : "bg-red-500",
      bgColor: promoter.status == "active" ? "bg-green-50" : "bg-red-50",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.section
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-4"
    >
      <h2 className="text-xl font-bold text-foreground">
        لوحة المؤشرات العامة
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            className={`${kpi.bgColor} rounded-xl p-5 border border-border/50`}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  {kpi.title}
                </p>
                <p className="text-2xl font-bold text-foreground">
                  {kpi.value}
                </p>
              </div>
              <div className={`${kpi.color} p-2.5 rounded-lg`}>
                <kpi.icon className="w-5 h-5 text-white" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
