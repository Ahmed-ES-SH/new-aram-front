"use client";
import NotificationPopup from "../../_website/_notifications/NotificationPopup";
import Pusher from "pusher-js";
import Img from "../../_website/_global/Img";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { FaBell } from "react-icons/fa";
import { TbBellRingingFilled } from "react-icons/tb";
import { useDispatch } from "react-redux";
import { FiCheck } from "react-icons/fi";
import { truncateContent } from "@/app/_helpers/helpers";
import { toast } from "sonner";
import { instance } from "@/app/_helpers/axios";
import { setUnreadNotificationsCount } from "@/app/Store/userSlice";
import { useAppSelector } from "@/app/Store/hooks";
import {
  setShowMessagesDrop,
  setShowNotificationDrop,
  setShowUserButton,
} from "@/app/Store/variablesSlice";
import NotificationCard from "./NotificationCard";
import { VscLoading } from "react-icons/vsc";

// أنواع البيانات للإشعارات بناء على هيكل البيانات الجديد
export interface Notification {
  id: number;
  content: string;
  created_at: string;
  is_read: boolean;
  recipient: {
    email: string;
    id: number;
    image: string;
    name: string;
  };
  recipient_id: number;
  recipient_type: string;
  sender: {
    email: string;
    id: number;
    image: string;
    name: string;
  };
  sender_id: number;
  sender_type: string;
  updated_at: string;
}

interface Props {
  notifications: Notification[];
}

export default function NotificationsDropDown({ notifications: data }: Props) {
  const dispatch = useDispatch();
  const { user } = useAppSelector((state) => state.user);
  const { showNotificationDrop } = useAppSelector((state) => state.variables);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [visible, setVisible] = useState(false);
  const [newNotification, setNewNotification] = useState<Notification | null>(
    null
  );
  const [notifications, setNotifications] = useState<Notification[]>(
    data ?? []
  );
  const [loading, setLoading] = useState(false);

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

  // Mark all as read
  const markAllAsRead = async () => {
    try {
      setLoading(true);
      const response = await instance.post(
        `/make-notifications-readed/${user?.id}`
      );
      if (response.status == 200) {
        toast.success("تم تحديث حالة الاشعارات الى مقروءة");
        setNotifications((prev: any) =>
          prev.map((not) => ({ ...not, is_read: 1 }))
        );
        dispatch(setUnreadNotificationsCount(0));
      }
    } catch (error: any) {
      console.log(error);
      const message =
        error?.response?.data?.message["ar"] ??
        error?.response?.data?.message ??
        "حدث خطا اثناء تحديث حالة الاشعارات .";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  // حساب عدد الإشعارات غير المقروءة
  const unreadCount = notifications.filter(
    (notification) => !notification.is_read
  ).length;

  // Subscribe to Pusher channel
  useEffect(() => {
    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
    });

    const channel = pusher.subscribe(
      `notifications.${user?.account_type}.${user?.id}`
    );

    channel.bind("NotificationSent", (data: Notification) => {
      setNewNotification(data);
      setVisible(true);
      setNotifications((prev) =>
        [data, ...prev].sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )
      );
      dispatch(setUnreadNotificationsCount("increment"));
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
      pusher.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return (
    <>
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
              className="w-[400px] h-[500px] absolute right-0 shadow-xl rounded-xl bg-white border border-gray-200 z-50 overflow-hidden"
            >
              {/* السهم أعلى القائمة */}
              <div className="absolute -top-2 right-6 w-4 h-4 bg-white border-t border-l border-gray-200 transform rotate-45"></div>

              {/* رأس القائمة */}
              <div className="p-4 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-lg shadow-sm">
                      <FaBell className="text-primary size-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-800">
                        الإشعارات
                      </h3>
                      <p className="text-sm text-gray-600">
                        {notifications.length} إشعار
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {unreadCount > 0 && (
                      <span className="bg-primary text-white text-xs rounded-full px-3 py-1 font-medium">
                        {unreadCount} جديد
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* قائمة الإشعارات أو حالة عدم وجود إشعارات */}
              <div className="h-[calc(100%-140px)] overflow-y-auto">
                {notifications.length > 0 ? (
                  notifications.map((notification) => (
                    <NotificationCard
                      key={`${notification.id}-${notification.created_at}`}
                      notification={notification}
                    />
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                    {/* حالة عدم وجود إشعارات */}
                    <div className="w-24 h-24 mb-6 rounded-full bg-linear-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                      <FaBell className="text-gray-400 size-12" />
                    </div>
                    <h4 className="text-xl font-bold text-gray-700 mb-3">
                      لا توجد إشعارات
                    </h4>
                    <p className="text-gray-500 mb-6 max-w-sm">
                      ليس لديك أي إشعارات حالياً. سيظهر هنا أي إشعارات جديدة
                      تتلقاها.
                    </p>
                    <div className="bg-linear-to-r from-gray-50 to-gray-100 rounded-xl p-4 max-w-sm">
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">مثال على الإشعارات:</span>
                        طلبات جديدة، تحديثات النظام، رسائل من المستخدمين،
                        وغيرها.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* أزرار الإجراءات (تظهر فقط عند وجود إشعارات) */}
              {notifications.length > 0 && (
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-white">
                  <div className="flex gap-3">
                    <button
                      onClick={markAllAsRead}
                      className="flex-1 flex items-center justify-center py-3 bg-primary hover:bg-primary/80 text-white rounded-xl transition-all duration-200 text-sm font-medium shadow-sm hover:shadow-md"
                    >
                      {loading ? (
                        <VscLoading className="animate-spin size-5 lg:size-6" />
                      ) : (
                        <div className="flex items-center gap-1">
                          <FiCheck className="size-4" />
                          تحديد الكل كمقروء
                        </div>
                      )}
                    </button>
                    <button
                      onClick={() => console.log("عرض جميع الإشعارات")}
                      className="flex-1 py-3 bg-white hover:bg-primary/70 hover:text-white text-gray-700 rounded-xl transition-all duration-200 text-sm font-medium border border-gray-300 shadow-sm hover:shadow-md"
                    >
                      عرض الكل
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <NotificationPopup
        message={newNotification?.content}
        sender={newNotification?.sender as any}
        visible={visible}
        onClose={() => setVisible(false)}
      />
    </>
  );
}
