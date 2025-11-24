"use client";

import React from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useAppSelector } from "@/app/Store/hooks";
import { FaCircleUser } from "react-icons/fa6";
import { FaCcMastercard, FaRegCalendarAlt, FaWallet } from "react-icons/fa";
import { PiListChecksFill } from "react-icons/pi";
import { formatTitle } from "@/app/_helpers/helpers";
import { BiSolidConversation, BiSolidOffer } from "react-icons/bi";
import { MdLocalOffer } from "react-icons/md";
import LocaleLink from "@/app/_components/_website/_global/LocaleLink";

export default function CenterControlPanal() {
  const { user } = useAppSelector((state) => state.user);
  const t = useTranslations("centerPanal");

  const items = [
    {
      href: `/centercontrolpanel/orgprofile?account_name=${formatTitle(
        user?.title
      )}&acouunt_type=${user?.account_type}&id=${user?.id}`,
      icon: <FaCircleUser className="w-10 h-10 text-blue-600" />,
      title: t("profile.title"),
      desc: t("profile.desc"),
    },
    {
      href: `/centercontrolpanel/orgcards?account_name=${formatTitle(
        user?.title
      )}&acouunt_type=${user?.account_type}&userId=${user?.id}`,
      icon: <FaCcMastercard className="w-10 h-10 text-green-600" />,
      title: t("cards.title"),
      desc: t("cards.desc"),
    },
    {
      href: `/centercontrolpanel/orgreservations?account_name=${formatTitle(
        user?.title
      )}&acouunt_type=${user?.account_type}&userId=${user?.id}`,
      icon: <PiListChecksFill className="w-10 h-10 text-purple-600" />,
      title: t("reservations.title"),
      desc: t("reservations.desc"),
    },
    {
      href: `/conversations?account_name=${formatTitle(
        user?.title
      )}&acouunt_type=${user?.account_type}&userId=${user?.id}`,
      icon: <BiSolidConversation className="w-10 h-10 text-orange-600" />,
      title: t("conversations.title"),
      desc: t("conversations.desc"),
    },
    {
      href: `/centercontrolpanel/accountwallet?user_name=${formatTitle(
        user?.title
      )}&userId=${user?.id}&account_type=${user?.account_type}`,
      icon: <FaWallet className="w-10 h-10 text-yellow-600" />,
      title: t("wallet.title"),
      desc: t("wallet.desc"),
    },
    {
      href: `/centercontrolpanel/orgownedcoupones?account_type=${
        user?.account_type
      }&userId=${user?.id}&account_name=${formatTitle(user?.title)}`,
      icon: <BiSolidOffer className="w-10 h-10 text-pink-600" />,
      title: t("coupons.title"),
      desc: t("coupons.desc"),
    },
    {
      href: `/centercontrolpanel/orgoffers?organization_title=${formatTitle(
        user?.title
      )}&orgId=${user?.id}`,
      icon: <MdLocalOffer className="w-10 h-10 text-red-600" />,
      title: t("offers.title"),
      desc: t("offers.desc"),
    },
    {
      href: `/centercontrolpanel/orgschedule?organization_title=${formatTitle(
        user?.title
      )}&orgId=${user?.id}`,
      icon: <FaRegCalendarAlt className="w-10 h-10 text-cyan-600" />,
      title: t("schedule.title"),
      desc: t("schedule.desc"),
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
          <span className="text-primary underline">{user?.title}</span>
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
                <LocaleLink
                  className="items-center flex flex-col"
                  href={item.href}
                >
                  {item.icon}
                  <h2 className="text-lg font-semibold text-gray-800 mt-4">
                    {item.title}
                  </h2>
                  <p className="text-gray-500 text-sm mt-2">{item.desc}</p>
                </LocaleLink>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
