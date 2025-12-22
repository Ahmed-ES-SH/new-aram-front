"use client";
import { motion } from "framer-motion";
import { FiBell } from "react-icons/fi";
import { FilterType } from "./NotificationsPage";
import Img from "../_global/Img";

interface SidebarProps {
  currentUser: {
    name: string;
    image: string;
  };
  activeFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  unreadCount: number;
  texts: any;
}

export default function NotificationsSidebar({
  currentUser,
  activeFilter,
  onFilterChange,
  unreadCount,
  texts,
}: SidebarProps) {
  const filterButtons = [
    { key: "all" as FilterType, label: texts("filters.all"), count: null },
    {
      key: "unread" as FilterType,
      label: texts("filters.unread"),
      count: unreadCount,
    },
    { key: "read" as FilterType, label: texts("filters.read"), count: null },
  ];

  return (
    <div className="lg:sticky lg:top-24 space-y-6">
      {/* User Profile Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative bg-gradient-to-tr from-primary to-orange-500 rounded-3xl shadow-lg p-6 text-white overflow-hidden"
      >
        <div className="flex items-center gap-4">
          <div className="relative">
            <Img
              src={currentUser.image ?? "/defaults/male-noimage.jpg"}
              errorSrc="/defaults/male-noimage.jpg"
              alt={currentUser.name}
              className="w-16 h-16 rounded-full object-cover ring-4 ring-white/30 shadow-md"
            />
            <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-2 border-white rounded-full"></span>
          </div>
          <div>
            <h2 className="font-semibold text-lg">{currentUser.name}</h2>
            <p className="text-sm opacity-80">{texts("user.online")}</p>
          </div>
        </div>
        <div className="absolute ltr:right-4 rtl:left-4 top-4 bg-white/20 backdrop-blur-sm text-xs px-3 py-1 rounded-full">
          {texts("title")}
        </div>
      </motion.div>

      {/* Filter Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-white rounded-3xl shadow-md border border-gray-100 p-5"
      >
        <div className="flex items-center gap-2 mb-5">
          <FiBell className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-gray-800">{texts("title")}</h3>
        </div>

        <div className="flex flex-col gap-3">
          {filterButtons.map(({ key, label, count }) => {
            const isActive = activeFilter === key;
            return (
              <motion.button
                key={key}
                whileTap={{ scale: 0.95 }}
                onClick={() => onFilterChange(key)}
                className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 border ${
                  isActive
                    ? "bg-primary text-white border-primary shadow-sm"
                    : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
                }`}
              >
                <span className="font-medium">{label}</span>
                {count !== null && count > 0 && (
                  <span
                    className={`inline-flex items-center justify-center w-6 h-6 text-xs font-bold rounded-full ${
                      isActive
                        ? "bg-white text-primary"
                        : "bg-primary text-white"
                    }`}
                  >
                    {count}
                  </span>
                )}
              </motion.button>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
