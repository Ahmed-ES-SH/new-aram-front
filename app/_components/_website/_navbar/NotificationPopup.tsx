"use client";
import { AnimatePresence, motion } from "framer-motion";
import React, { useState } from "react";
import { MdNotificationsActive } from "react-icons/md";
import { AiOutlineClose } from "react-icons/ai";
import { useLocale } from "next-intl";
import { directionMap } from "@/app/constants/_website/global";

export default function Notificationpopup() {
  const locale = useLocale() || "en";

  const [newNotification] = useState({
    message: "",
  });
  const [isVisible] = useState(false);
  const [progress] = useState(100); // نسبة التقدم في الخط

  const clearnewnot = () => {};

  return (
    <>
      <AnimatePresence>
        {newNotification && isVisible && (
          <motion.div
            dir={directionMap[locale]}
            className={`fixed top-20 ltr:right-4 rtl:left-4 bg-main_orange text-white p-4 rounded-lg shadow-lg w-72`}
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <MdNotificationsActive className="text-xl mr-2" />
                <p className="text-sm">
                  {newNotification.message &&
                    newNotification.message.slice(0, 60) + "..."}
                </p>
              </div>
              <AiOutlineClose
                className="text-xl cursor-pointer"
                onClick={clearnewnot}
              />
            </div>
            {/* خط يتناقص تدريجياً */}
            <div className="w-full mt-2 h-1 bg-white">
              <motion.div
                className="h-full bg-primary"
                style={{ width: `${progress}%` }}
                transition={{ duration: 0.1 }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
