"use client";
import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useRef } from "react";
import { FaBell } from "react-icons/fa";
import { TbBellRingingFilled } from "react-icons/tb";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/app/Store/store";
import {
  setShowMessagesDrop,
  setShowNotificationDrop,
  setShowUserButton,
} from "@/app/Store/variablesSlice";

// أنواع البيانات للإشعارات
interface Notification {
  id: number;
  title: string;
  message: string;
  time: string;
  isRead: boolean;
  type: "success" | "warning" | "info" | "error";
  icon: string;
}

export default function NotificationsDropDown() {
  const dispatch = useDispatch();
  const { showNotificationDrop } = useSelector(
    (state: RootState) => state.variables
  );
  const dropdownRef = useRef<HTMLDivElement>(null);

  // بيانات وهمية للإشعارات
  const mockNotifications: Notification[] = [
    {
      id: 1,
      title: "طلب جديد",
      message: "تم استلام طلب جديد من العميل محمد",
      time: "منذ 5 دقائق",
      isRead: false,
      type: "success",
      icon: "🛒",
    },
    {
      id: 2,
      title: "دفعة مستلمة",
      message: "تم استلام دفعة بقيمة 150 ر.ع",
      time: "منذ ساعة",
      isRead: false,
      type: "success",
      icon: "💰",
    },
    {
      id: 3,
      title: "تحذير النظام",
      message: "يجب تحديث معلومات المتجر",
      time: "منذ 3 ساعات",
      isRead: true,
      type: "warning",
      icon: "⚠️",
    },
    {
      id: 4,
      title: "رسالة جديدة",
      message: "لديك رسالة جديدة من الدعم الفني",
      time: "منذ 5 ساعات",
      isRead: true,
      type: "info",
      icon: "💬",
    },
    {
      id: 5,
      title: "تحديث النظام",
      message: "تم تحديث النظام إلى الإصدار 2.1.0",
      time: "منذ يوم",
      isRead: true,
      type: "info",
      icon: "🔄",
    },
    {
      id: 6,
      title: "مشكلة في الدفع",
      message: "فشل في معالجة الدفع للطلب #1234",
      time: "منذ يومين",
      isRead: true,
      type: "error",
      icon: "❌",
    },
  ];

  const toggleDropdown = () => {
    dispatch(setShowNotificationDrop(!showNotificationDrop));
    dispatch(setShowUserButton(false));
    dispatch(setShowMessagesDrop(false));
  };

  // إغلاق القائمة عند الضغط خارجها
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        dispatch(setShowNotificationDrop(false));
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dispatch]);

  // معالجة النقر على إشعار
  const handleNotificationClick = (notificationId: number) => {
    console.log(`فتح الإشعار: ${notificationId}`);
    // هنا يمكنك إضافة منطق فتح الإشعار أو تحديده كمقروء
    dispatch(setShowNotificationDrop(false));
  };

  // تحديد لون حسب نوع الإشعار
  const getNotificationColor = (type: string) => {
    switch (type) {
      case "success":
        return "text-green-600 bg-green-50 border-green-200";
      case "warning":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "error":
        return "text-red-600 bg-red-50 border-red-200";
      case "info":
      default:
        return "text-blue-600 bg-blue-50 border-blue-200";
    }
  };

  // حساب عدد الإشعارات غير المقروءة
  const unreadCount = mockNotifications.filter(
    (notification) => !notification.isRead
  ).length;

  return (
    <div className="relative" ref={dropdownRef}>
      <div onClick={toggleDropdown} className="relative w-fit cursor-pointer">
        {unreadCount > 0 ? (
          <div className="relative">
            <TbBellRingingFilled className="text-white size-6 max-md:size-5" />
            <span className="absolute -top-2 -right-1 w-4 h-4 rounded-full bg-red-500 flex items-center justify-center text-white text-xs">
              {unreadCount}
            </span>
          </div>
        ) : (
          <FaBell className="text-white size-6 max-md:size-5" />
        )}
      </div>

      <AnimatePresence>
        {showNotificationDrop && (
          <motion.div
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 40, opacity: 1 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="w-[380px] h-[450px] absolute right-0 shadow-lg rounded-lg bg-white border border-gray-200 z-50 overflow-hidden"
          >
            {/* السهم أعلى القائمة */}
            <div className="absolute -top-2 right-4 w-4 h-4 bg-white border-t border-l border-gray-200 transform rotate-45"></div>

            {/* رأس القائمة */}
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-800">
                  الإشعارات
                </h3>
                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1">
                      {unreadCount} جديد
                    </span>
                  )}
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                {mockNotifications.length} إشعار
              </p>
            </div>

            {/* قائمة الإشعارات */}
            <div className="max-h-[300px] overflow-y-auto">
              {mockNotifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification.id)}
                  className={`flex items-start gap-3 p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${
                    !notification.isRead ? "bg-blue-50 hover:bg-blue-100" : ""
                  }`}
                >
                  {/* أيقونة الإشعار */}
                  <div
                    className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-lg ${getNotificationColor(
                      notification.type
                    )}`}
                  >
                    {notification.icon}
                  </div>

                  {/* محتوى الإشعار */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <h4
                        className={`font-medium text-sm ${
                          !notification.isRead
                            ? "text-blue-800"
                            : "text-gray-800"
                        }`}
                      >
                        {notification.title}
                      </h4>
                      <span className="text-xs text-gray-500 whitespace-nowrap">
                        {notification.time}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {notification.message}
                    </p>
                  </div>

                  {/* مؤشر القراءة */}
                  {!notification.isRead && (
                    <div className="shrink-0">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* أزرار الإجراءات */}
            <div className="p-3 border-t border-gray-200 bg-gray-50 flex gap-2">
              <button className="flex-1 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium">
                تحديد الكل كمقروء
              </button>
              <button className="flex-1 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm font-medium">
                عرض الكل
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
