"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiBell } from "react-icons/fi";
import { IoMdClose } from "react-icons/io";
import { useAppSelector } from "@/app/Store/hooks";
import { directionMap } from "@/app/constants/_website/global";
import Img from "../_global/Img";

// Raw sender type coming from API
type RawSender = {
  id: number;
  name?: string;
  image?: string;
  title?: string;
  logo?: string;
  account_type: string;
  email: string;
};

type NotificationPopupProps = {
  visible: boolean;
  message: string | undefined;
  sender: RawSender | undefined;
  sender_type?: "user" | "organization";
  onClose: () => void;
};

export default function NotificationPopup({
  visible,
  message,
  sender,
  sender_type,
  onClose,
}: NotificationPopupProps) {
  const { locale } = useAppSelector((state) => state.variables);
  const [progress, setProgress] = useState(100);

  // ✅ Normalize sender data based on sender_type
  const normalizedSender = sender
    ? sender.account_type == "organization"
      ? {
          id: sender.id,
          name: sender.title ?? "organization",
          email: sender.email,
          image: sender.logo ?? null,
          account_type: "Organization",
        }
      : {
          id: sender.id,
          name: sender.name ?? "user",
          email: sender.email,
          image: sender.image ?? null,
          account_type: "User",
        }
    : undefined;

  useEffect(() => {
    if (!visible) return;

    setProgress(100);

    // Play sound
    const audio = new Audio("/sounds/notification.mp3");
    audio.play().catch(() => {
      console.warn("Sound could not be played automatically.");
    });

    const timeout = setTimeout(() => onClose(), 5000);

    const start = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - start;
      setProgress(Math.max(100 - (elapsed / 5000) * 100, 0));
    }, 50);

    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, [visible, onClose]);

  if (!visible || !message || !normalizedSender) return null;

  return (
    <div dir={directionMap[locale]}>
      <AnimatePresence>
        {true && (
          <motion.div
            initial={{ x: 400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 400, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed top-6 ltr:right-6 rtl:left-6 lg:w-96 w-80 bg-white shadow-xl rounded-2xl p-4 z-[999999] border border-gray-200"
          >
            {/* Header with icons */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <FiBell className="text-primary text-xl" />
                <span className="font-semibold text-gray-700">
                  New Notification
                </span>
              </div>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-red-500"
              >
                <IoMdClose size={20} />
              </button>
            </div>

            {/* Sender info + message */}
            <div className="flex items-center gap-3 mb-3">
              <Img
                src={normalizedSender.image ?? "/defaults/male-noimage.jpg"}
                errorSrc="/defaults/male-noimage.jpg"
                alt={normalizedSender.name}
                className={`h-[40px] w-[40px] object-cover ${
                  sender_type === "organization" ? "rounded-lg" : "rounded-full"
                }`}
              />
              <div>
                <p className="text-xs font-bold text-gray-800">
                  {normalizedSender.name}
                </p>
                <p className="text-sm text-gray-500">{message}</p>
              </div>
            </div>

            {/* Progress bar */}
            <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-primary"
                style={{ width: `${progress}%` }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
