"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  HiOutlineCreditCard,
  HiOutlineCalendar,
  HiOutlineCurrencyDollar,
  HiOutlineChatAlt2,
  HiOutlineCash,
  HiOutlineUser,
  HiOutlineTicket,
} from "react-icons/hi";
import { useTranslations } from "next-intl";
import { useAppSelector } from "@/app/Store/hooks";

export default function DashboardPage() {
  const { user } = useAppSelector((state) => state.user);
  const t = useTranslations("userControl");

  const items = [
    {
      icon: <HiOutlineCreditCard className="w-10 h-10 text-green-600" />,
      title: t("cards.title"),
      desc: t("cards.desc"),
    },

    {
      icon: <HiOutlineUser className="w-10 h-10 text-blue-600" />,
      title: t("profile.title"),
      desc: t("profile.desc"),
    },
    {
      icon: <HiOutlineTicket className="w-10 h-10 text-purple-600" />,
      title: t("coupons.title"),
      desc: t("coupons.desc"),
    },
    {
      icon: <HiOutlineCalendar className="w-10 h-10 text-blue-500" />,
      title: t("bookings.title"),
      desc: t("bookings.desc"),
    },
    {
      icon: <HiOutlineCurrencyDollar className="w-10 h-10 text-yellow-500" />,
      title: t("balance.title"),
      desc: t("balance.desc"),
    },
    {
      icon: <HiOutlineCash className="w-10 h-10 text-purple-500" />,
      title: t("payments.title"),
      desc: t("payments.desc"),
    },
    {
      icon: <HiOutlineChatAlt2 className="w-10 h-10 text-pink-500" />,
      title: t("chats.title"),
      desc: t("chats.desc"),
    },
  ];

  return (
    <div className="min-h-screen lg:flex-1/2 w-full mt-8 p-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className=""
      >
        <h1 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-2 flex-wrap">
          <span>{t("hi")},</span>
          <span className="text-primary underline">{user?.name}</span>
          <span>{t("welcome")}</span>
        </h1>

        <p className="text-gray-600 mb-10">{t("subtitle")}</p>

        <div className="min-h-[50vh] flex items-center  justify-center">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.05 }}
                className="bg-white cursor-pointer hover:bg-primary/10 duration-300 shadow-sm rounded-2xl p-6 flex flex-col items-center text-center hover:shadow-md transition-shadow"
              >
                {item.icon}
                <h2 className="text-lg font-semibold text-gray-800 mt-4">
                  {item.title}
                </h2>
                <p className="text-gray-500 text-sm mt-2">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
