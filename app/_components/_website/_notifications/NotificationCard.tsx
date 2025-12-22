"use client";
import { easeOut, motion } from "framer-motion";
import { NotificationType } from "./NotificationBell";
import Img from "../_global/Img";
import { useLocale, useTranslations } from "next-intl";
import { directionMap } from "@/app/constants/_website/global";

interface NotificationCardProps {
  notification: NotificationType;
  index: number;
}

export default function NotificationCard({
  notification,
  index,
}: NotificationCardProps) {
  const locale = useLocale();
  const t = useTranslations("time");

  const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.4, delay: index * 0.08, ease: easeOut },
    },
  };

  // Decide display fields based on sender_type
  const senderName =
    notification.sender_type === "user"
      ? notification.sender?.name
      : notification.sender?.title;

  const senderAvatar =
    notification.sender_type === "user"
      ? notification.sender?.image
      : notification.sender?.logo;

  // Format "time ago"
  const formatTimeAgo = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return t("just_now");
    if (diffInSeconds < 3600) {
      const count = Math.floor(diffInSeconds / 60);
      return t("minutes_ago", { count });
    }
    if (diffInSeconds < 86400) {
      const count = Math.floor(diffInSeconds / 3600);
      return t("hours_ago", { count });
    }
    if (diffInSeconds < 604800) {
      const count = Math.floor(diffInSeconds / 86400);
      return t("days_ago", { count });
    }

    return date.toLocaleDateString();
  };

  return (
    <motion.div
      dir="rtl"
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ scale: 1.02 }}
      className={`relative rounded-2xl overflow-hidden border shadow-md transition-all duration-200 group ${
        !notification.is_read
          ? "border-primary/40 bg-gradient-to-br from-blue-50 to-white"
          : "border-gray-200 bg-white"
      }`}
    >
      {/* Accent bar for unread */}
      {!notification.is_read && (
        <div className="absolute top-0 left-0 w-1 h-full bg-primary"></div>
      )}

      <div className="p-5 flex gap-4">
        {/* Sender avatar */}
        <div className="flex-shrink-0">
          <Img
            src={senderAvatar ?? "/defaults/male-noimage.jpg"}
            errorSrc="/defaults/male-noimage.jpg"
            alt={senderName}
            className="w-14 h-14 rounded-full object-cover ring-2 ring-gray-100 group-hover:ring-blue-400 transition"
          />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 min-w-0">
              <h3 className="font-semibold text-gray-900 truncate">
                {senderName}
              </h3>
              <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-200 text-gray-700">
                {notification.sender_type}
              </span>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <span
                dir={directionMap[locale]}
                className="text-xs text-gray-500"
              >
                {formatTimeAgo(notification.created_at)}
              </span>
              {!notification.is_read && (
                <span className="w-2 h-2 bg-primary rounded-full"></span>
              )}
            </div>
          </div>

          <p className="text-gray-700 leading-relaxed line-clamp-3">
            {notification.content}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
