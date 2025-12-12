import React from "react";
import { Notification } from "./NotificationsDropDown";
import Img from "../../_website/_global/Img";
import { getRelativeTime, truncateContent } from "@/app/_helpers/helpers";
import { FiCheck } from "react-icons/fi";

export default function NotificationCard({
  notification,
}: {
  notification: Notification;
}) {
  // تحديد لون حسب حالة الإشعار (مقروء / غير مقروء)
  const getNotificationStyle = (isRead: boolean) => {
    return isRead
      ? "bg-white hover:bg-gray-50"
      : "bg-orange-50 border-r-4 border-primary";
  };

  return (
    <>
      <div
        key={notification.id}
        className={`flex items-start gap-3 p-4 border-b border-gray-100 cursor-pointer transition-all duration-200 ${getNotificationStyle(
          notification.is_read
        )}`}
      >
        {/* صورة المرسل */}
        <div className="relative shrink-0">
          <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-sm">
            <Img
              src={notification.sender.image ?? "/defaults/male-noimage.jpg"}
              errorSrc="/defaults/male-noimage.jpg"
              alt={notification.sender.name}
              className="w-[48px] h-[48px] rounded-full object-cover"
            />
          </div>
          {!notification.is_read && (
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full border-2 border-white"></div>
          )}
        </div>

        {/* محتوى الإشعار */}
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h4
                className={`font-bold text-sm ${
                  !notification.is_read ? "text-gray-900" : "text-gray-700"
                }`}
              >
                {notification.sender.name}
              </h4>
              <p className="text-xs text-gray-500">
                {notification.sender.email}
              </p>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-xs text-gray-500 whitespace-nowrap">
                {getRelativeTime(notification.created_at)}
              </span>
              {!notification.is_read && (
                <span className="text-xs text-primary font-medium mt-1">
                  جديد
                </span>
              )}
            </div>
          </div>
          <div className="bg-primary rounded-lg p-3 mt-2">
            <p className="text-sm text-white leading-relaxed">
              {truncateContent(notification.content, 50)}
            </p>
          </div>

          {/* معلومات إضافية */}
          <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <FiCheck className="size-3" />
              <span>{notification.is_read ? "تم القراءة" : "غير مقروء"}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
