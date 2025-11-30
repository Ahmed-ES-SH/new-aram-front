"use client";

import { motion } from "framer-motion";
import { FiUser, FiGrid, FiMail, FiBell, FiClock } from "react-icons/fi";
import { Activity } from "./types";

// Sample activity data
const activitiesData: Activity[] = [
  {
    id: "1",
    type: "user",
    title: "تسجيل مستخدم جديد: محمد أحمد",
    time: "منذ 5 دقائق",
    icon: <FiUser className="h-4 w-4" />,
  },
  {
    id: "2",
    type: "service",
    title: "إضافة خدمة جديدة: تدليك علاجي",
    time: "منذ 15 دقيقة",
    icon: <FiGrid className="h-4 w-4" />,
  },
  {
    id: "3",
    type: "message",
    title: "رسالة جديدة من: مركز الشفاء",
    time: "منذ 30 دقيقة",
    icon: <FiMail className="h-4 w-4" />,
  },
  {
    id: "4",
    type: "notification",
    title: "تفعيل عرض خاص على خدمات السبا",
    time: "منذ ساعة",
    icon: <FiBell className="h-4 w-4" />,
  },
  {
    id: "5",
    type: "user",
    title: "تسجيل مستخدم جديد: سارة خالد",
    time: "منذ ساعتين",
    icon: <FiUser className="h-4 w-4" />,
  },
  {
    id: "6",
    type: "service",
    title: "تحديث خدمة: العلاج الطبيعي المتقدم",
    time: "منذ 3 ساعات",
    icon: <FiGrid className="h-4 w-4" />,
  },
];

// Get style based on activity type
function getActivityStyle(type: Activity["type"]) {
  switch (type) {
    case "user":
      return { bg: "bg-blue-100", text: "text-blue-600" };
    case "service":
      return { bg: "bg-green-100", text: "text-green-600" };
    case "message":
      return { bg: "bg-purple-100", text: "text-purple-600" };
    case "notification":
      return { bg: "bg-orange-100", text: "text-orange-600" };
    default:
      return { bg: "bg-gray-100", text: "text-gray-600" };
  }
}

// Single activity item component
function ActivityItem({
  activity,
  index,
}: {
  activity: Activity;
  index: number;
}) {
  const style = getActivityStyle(activity.type);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="flex items-center gap-4 rounded-xl p-3 transition-colors hover:bg-gray-50"
    >
      <div
        className={`flex h-10 w-10 items-center justify-center rounded-full ${style.bg} ${style.text}`}
      >
        {activity.icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">
          {activity.title}
        </p>
        <div className="flex items-center gap-1 mt-1">
          <FiClock className="h-3 w-3 text-gray-400" />
          <span className="text-xs text-gray-500">{activity.time}</span>
        </div>
      </div>
    </motion.div>
  );
}

// Recent activity section component
export function RecentActivity() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100 h-full"
    >
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-bold text-gray-900">آخر النشاطات</h3>
        <button className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors">
          عرض الكل
        </button>
      </div>

      <div className="space-y-1">
        {activitiesData.map((activity, index) => (
          <ActivityItem key={activity.id} activity={activity} index={index} />
        ))}
      </div>
    </motion.div>
  );
}
