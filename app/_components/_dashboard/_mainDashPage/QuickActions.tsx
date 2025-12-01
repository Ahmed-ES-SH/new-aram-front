"use client";

import { motion } from "framer-motion";
import {
  FaUserPlus,
  FaHospital,
  FaBullhorn,
  FaTicketAlt,
  FaBell,
  FaCreditCard,
} from "react-icons/fa";
import { ReactNode } from "react";
import LocaleLink from "../../_website/_global/LocaleLink";

// Type definition for Quick Action item
interface QuickActionItem {
  id: number;
  title: string;
  icon: ReactNode;
  color: string;
  bgColor: string;
  to: string;
}

// Main component
export default function QuickActions() {
  // Action items data
  const quickActions: QuickActionItem[] = [
    {
      id: 1,
      title: "إضافة مستخدم",
      icon: <FaUserPlus className="text-lg" />,
      color: "text-blue-600",
      bgColor: "bg-blue-50 hover:bg-blue-100",
      to: "/dashboard/adduser",
    },
    {
      id: 2,
      title: "إضافة مركز",
      icon: <FaHospital className="text-lg" />,
      color: "text-green-600",
      bgColor: "bg-green-50 hover:bg-green-100",
      to: "/dashboard/addorganization",
    },
    {
      id: 3,
      title: "إضافة مروج",
      icon: <FaBullhorn className="text-lg" />,
      color: "text-purple-600",
      bgColor: "bg-purple-50 hover:bg-purple-100",
      to: "/dashboard/addpromoter",
    },
    {
      id: 4,
      title: "إرسال كوبون",
      icon: <FaTicketAlt className="text-lg" />,
      color: "text-amber-600",
      bgColor: "bg-amber-50 hover:bg-amber-100",
      to: "/dashboard/sendcoupon",
    },
    {
      id: 5,
      title: "إرسال إشعار",
      icon: <FaBell className="text-lg" />,
      color: "text-red-600",
      bgColor: "bg-red-50 hover:bg-red-100",
      to: "/dashboard/usernotification",
    },
    {
      id: 6,
      title: "إضافة بطاقة جديدة",
      icon: <FaCreditCard className="text-lg" />,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50 hover:bg-indigo-100",
      to: "/dashboard/addcard",
    },
  ];

  // Container animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  // Item animation variants
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
      },
    },
  };

  return (
    <section className="w-full px-4 py-6" dir="rtl">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800">
          الإجراءات السريعة
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          نفذ المهام الشائعة بسرعة من خلال هذه الإجراءات
        </p>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4"
      >
        {quickActions.map((action) => (
          <LocaleLink
            className={`
              flex flex-col items-center justify-center
              p-4 rounded-xl
              border border-gray-200
              transition-all duration-200
              cursor-pointer
              ${action.bgColor}
              min-h-[100px]
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300
            `}
            href={action.to}
          >
            <div className={`${action.color} mb-3`}>{action.icon}</div>
            <span className="text-sm font-medium text-gray-800 text-center leading-tight">
              {action.title}
            </span>
          </LocaleLink>
        ))}
      </motion.div>
    </section>
  );
}

// Usage example for a dashboard page:
/*
import QuickActions from '@/components/QuickActions';

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <QuickActions />
      {/* Rest of dashboard content * /}
    </div>
  );
}
*/
