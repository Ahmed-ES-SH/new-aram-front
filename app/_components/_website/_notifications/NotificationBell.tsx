"use client";

import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaBellSlash } from "react-icons/fa";
import { toast } from "sonner";
import { instance } from "@/app/_helpers/axios";
import { useAppDispatch } from "@/app/Store/hooks";
import { IoCheckmarkDoneOutline } from "react-icons/io5";
import { VscLoading } from "react-icons/vsc";
import Pusher from "pusher-js";
import LocaleLink from "../_global/LocaleLink";
import { useLocale, useTranslations } from "next-intl";
import { directionMap } from "@/app/constants/_website/global";
import NotificationPopup from "./NotificationPopup";
import { setUnreadNotificationsCount } from "@/app/Store/userSlice";
import { PiBellRingingFill } from "react-icons/pi";
import Img from "../_global/Img";

type Sender = {
  id: number;
  name: string;
  image: string;
  email: string;
  account_type: string;
  title?: string;
  logo?: string;
};

type Recipient = {
  id: number;
  name: string;
  image: string;
  email: string;
  account_type: string;
  title?: string;
  logo?: string;
};

export type NotificationType = {
  id: number;
  content: string;
  is_read: number;
  recipient_id: number;
  sender_id: number;
  sender_type: "user" | "organization";
  created_at: string;
  updated_at: string;
  sender: Sender;
  recipient: Recipient;
};

interface NotificationBellProps {
  notifications: NotificationType[];
  setNotifications: Dispatch<SetStateAction<NotificationType[]>>;
  userId: number | string;
  accountType: string;
  unreadCount: number;
}

export default function NotificationBell({
  notifications,
  setNotifications,
  userId,
  accountType,
  unreadCount,
}: NotificationBellProps) {
  const locale = useLocale();
  const t = useTranslations("notificationsPopup");
  const dispatch = useAppDispatch();

  const containerRef = useRef<HTMLDivElement>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [newNotification, setNewNotification] =
    useState<NotificationType | null>(null);

  // Mark all as read
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
        error?.response?.data?.message[locale] ||
        "حدث خطا اثناء تحديث حالة الاشعارات .";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const onClosePopup = () => {
    setVisible(false);
  };

  // Subscribe to Pusher channel
  useEffect(() => {
    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
    });

    const channel = pusher.subscribe(`notifications.${accountType}.${userId}`);

    channel.bind("NotificationSent", (data: NotificationType) => {
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
  }, [userId]);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <div ref={containerRef} dir={directionMap[locale]} className="relative">
        {/* Bell button */}
        <button
          onClick={() => setIsOpen((prev) => !prev)}
          className="relative rounded-full hover:bg-gray-100 transition"
        >
          <PiBellRingingFill className="text-2xl text-primary" />
          {unreadCount > 0 && (
            <span className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 text-white text-[10px] flex items-center justify-center rounded-full">
              {unreadCount}
            </span>
          )}
        </button>

        {/* Notifications popup */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute max-md:ltr:-right-12 ltr:right-0 max-md:rtl:-left-12 rtl:left-0 mt-2 lg:w-[460px] w-80 bg-white rounded-2xl shadow-lg border border-gray-200 z-50"
            >
              <div className="flex items-center justify-between p-3 border-b border-gray-300">
                <span className="font-semibold text-gray-700">
                  {t("title")}
                </span>
                {notifications.length > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-xs flex items-center gap-1 text-primary hover:underline"
                  >
                    {loading ? (
                      <VscLoading className="animate-spin text-green-400" />
                    ) : (
                      <>
                        <IoCheckmarkDoneOutline />
                        {t("markAllRead")}
                      </>
                    )}
                  </button>
                )}
              </div>
              <div className="max-h-96 overflow-y-auto">
                {notifications && notifications.length > 0 ? (
                  notifications.map((notif) => {
                    const isUser = notif.sender_type === "user";
                    const senderName = isUser
                      ? notif.sender.name
                      : notif.sender.title || "not found";

                    const senderImage = isUser
                      ? notif.sender.image ?? "/defaults/male-noimage.jpg"
                      : notif.sender.logo ?? "/logo.png";

                    return (
                      <div
                        dir="rtl"
                        key={notif.id}
                        className={`flex items-start gap-3 p-3 border-b border-gray-200 hover:bg-gray-50 transition ${
                          notif.is_read === 0 ? "bg-sky-100" : "bg-white"
                        }`}
                      >
                        <Img
                          src={senderImage}
                          errorSrc={
                            isUser ? "/defaults/male-noimage.jpg" : "/logo.png"
                          }
                          alt={senderName}
                          className="rounded-full w-14 h-14 object-cover"
                        />
                        <div className="flex-1 flex flex-col gap-1 items-start">
                          <p className="text-sm text-gray-800">
                            {notif.content}
                          </p>
                          <span className="block text-xs text-gray-600 font-medium">
                            {senderName}
                          </span>
                          <span className="text-xs text-gray-500">
                            {new Date(notif.created_at).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="min-h-[30vh] flex items-center justify-center">
                    <div className="flex flex-col items-center gap-4">
                      <FaBellSlash className="text-gray-400 size-20" />
                      <p className="text-sm text-gray-500 p-4 text-center">
                        {t("noNotifications")}
                      </p>
                    </div>
                  </div>
                )}
              </div>
              {/* View all button */}
              <div className="p-3 border-t border-gray-300 flex justify-center">
                <LocaleLink
                  href={`/notifications?userId=${userId}&account_type=${accountType}`}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-white text-sm font-medium shadow hover:bg-primary/90 transition"
                >
                  <PiBellRingingFill className="text-lg" />
                  {locale === "ar"
                    ? "عرض جميع الإشعارات"
                    : "View All Notifications"}
                </LocaleLink>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <NotificationPopup
        message={newNotification?.content}
        sender={newNotification?.sender}
        visible={visible}
        onClose={onClosePopup}
      />
    </>
  );
}
