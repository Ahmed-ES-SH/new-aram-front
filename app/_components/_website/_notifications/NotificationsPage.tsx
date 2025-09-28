"use client";
import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppDispatch, useAppSelector } from "@/app/Store/hooks";
import LoadingPage from "../_global/LoadingPage";
import { instance } from "@/app/_helpers/axios";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";
import { VscLoading } from "react-icons/vsc";
import { IoCheckmarkDoneOutline } from "react-icons/io5";
import ServerPagination from "../_global/ServerPagination";
import EmptyState from "./EmptyState";
import NotificationCard from "./NotificationCard";
import NotificationsSidebar from "./NotificationsSidebar";
import { directionMap } from "@/app/constants/_website/global";
import { setUnreadNotificationsCount } from "@/app/Store/userSlice";
import { NotificationType } from "./NotificationBell";
import { useLocale, useTranslations } from "next-intl";

interface NotificationsPageProps {
  notifications: NotificationType[];
  pagination: {
    current_page: number;
    last_page: number;
  };
}

export type FilterType = "all" | "unread" | "read";

// Main Component
export default function NotificationsPage({
  notifications: data,
  pagination,
}: NotificationsPageProps) {
  const { user: currentUser, loading: userLoading } = useAppSelector(
    (state) => state.user
  );

  const locale = useLocale();

  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");

  const dispatch = useAppDispatch();

  const t = useTranslations("notificationsPage");

  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [notifications, setNotifications] = useState<NotificationType[]>(
    data ?? []
  );
  const [loading, setLoading] = useState(false);

  const filteredNotifications = useMemo(() => {
    switch (activeFilter) {
      case "unread":
        return notifications.filter((n) => !n.is_read);
      case "read":
        return notifications.filter((n) => n.is_read);
      default:
        return notifications;
    }
  }, [activeFilter, notifications]);

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.is_read).length,
    [notifications]
  );

  // ✅ Handle props error or missing data
  if (!data || !pagination) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <p className="text-gray-600 text-lg font-medium">
          {"حدث خطأ أثناء تحميل البيانات."}
        </p>
      </div>
    );
  }

  const markAllAsRead = async () => {
    try {
      setLoading(true);
      const response = await instance.post(
        `/make-notifications-readed/${userId}`
      );
      if (response.status == 200) {
        toast.success("تم تحديث حالة الاشعارات الى مقروءة");
        setNotifications((prev) => prev.map((not) => ({ ...not, is_read: 1 })));
        dispatch(setUnreadNotificationsCount(0));
      }
    } catch (error: any) {
      console.log(error);
      const message =
        error?.response?.data?.message ||
        "حدث خطا اثناء تحديث حالة الاشعارات .";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  if (userLoading) return <LoadingPage />;

  return (
    <div dir={directionMap[locale]} className="min-h-screen mt-20 bg-gray-50">
      <div className="c-container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <NotificationsSidebar
              currentUser={currentUser}
              activeFilter={activeFilter}
              onFilterChange={setActiveFilter}
              unreadCount={unreadCount}
              texts={t}
            />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="mb-6">
              <div className="flex items-center justify-between w-full">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {t("title")}
                </h1>
                {notifications.length > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="flex items-center p-2 border border-light-primary bg-primary hover:bg-white hover:scale-110 duration-300 hover:text-primary text-white  justify-center rounded-full gap-1"
                  >
                    {loading ? (
                      <VscLoading className="animate-spin size-7" />
                    ) : (
                      <>
                        <IoCheckmarkDoneOutline />
                        {t("markAllRead")}
                      </>
                    )}
                  </button>
                )}
              </div>
              <p className="text-gray-600">{t("subtitle")}</p>
            </div>

            <AnimatePresence mode="wait">
              {filteredNotifications.length === 0 ? (
                <EmptyState key="empty" filter={activeFilter} />
              ) : (
                <motion.div
                  key="notifications"
                  className="space-y-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {filteredNotifications.map((notification, index) => (
                    <NotificationCard
                      key={notification.id}
                      notification={notification}
                      index={index}
                      texts={t}
                    />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {pagination && pagination.last_page > 1 && (
              <ServerPagination
                currentPage={pagination.current_page}
                totalPages={pagination.last_page}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
