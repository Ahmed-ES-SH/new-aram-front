"use client";

import { useAppSelector } from "@/app/Store/hooks";
import { motion } from "framer-motion";
import { FiCalendar, FiUser } from "react-icons/fi";

// Dashboard header component with welcome message
export function DashboardHeader() {
  const { user } = useAppSelector((state) => state.user);

  const currentDate = new Date().toLocaleDateString("ar-SA", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const name = user?.name ?? user?.title ?? "غير معروف";

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="relative overflow-hidden rounded-2xl bg-linear-to-l from-blue-600 via-blue-500 to-indigo-600 p-8 text-white shadow-xl"
    >
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 h-full w-full">
        <div className="absolute top-0 left-0 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-48 w-48 rounded-full bg-indigo-400/20 blur-2xl" />
      </div>

      <div className="relative z-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="mb-2 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
              <FiUser className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold md:text-3xl">
                مرحباً بك، {name}! 👋
              </h1>
              <p className="text-blue-100">مدير النظام</p>
            </div>
          </div>
          <p className="mt-3 max-w-xl text-blue-100">
            مرحباً بك في لوحة التحكم الرئيسية. يمكنك من هنا متابعة جميع أنظمة
            المنصة والإحصائيات الهامة.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex items-center gap-2 rounded-xl bg-white/20 px-4 py-3 backdrop-blur-sm"
        >
          <FiCalendar className="h-5 w-5" />
          <span className="text-sm font-medium">{currentDate}</span>
        </motion.div>
      </div>
    </motion.header>
  );
}
