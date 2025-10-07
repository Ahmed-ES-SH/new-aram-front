"use client";
import React from "react";
import { FaStar, FaCalendarAlt } from "react-icons/fa";
import { motion } from "framer-motion";
import { Organization } from "@/app/_components/_dashboard/_organizations/types/organization";
import { BiSolidMessageSquareDetail } from "react-icons/bi";
import { VscLoading } from "react-icons/vsc";

interface props {
  organization: Organization;
  t: any;
  loadingConversation: boolean;
  handleStartConversation: () => void;
}

export default function OrganizationSidebar({
  organization,
  t,
  loadingConversation,
  handleStartConversation,
}: props) {
  const handleBookAppointment = async () => {};

  return (
    <>
      <motion.aside
        className="xl:col-span-1 max-xl:order-1"
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7 }}
      >
        <div className="sticky top-28 bg-white rounded-2xl shadow-xl border border-gray-200 p-6 space-y-6">
          {/* Quick Info */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-900">
              {t("quickInfo")}
            </h3>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <FaStar className="text-yellow-500" /> {organization.rating}
              <span className="text-gray-400">·</span>
              {organization.number_of_reservations} {t("reservations")}
            </div>
            {organization.confirmation_status === 1 && (
              <p className="text-green-600 font-medium">
                {t("confirmationPrice")}: ${organization.confirmation_price}
              </p>
            )}
          </div>

          {/* Buttons */}
          <div className="space-y-3">
            <motion.button
              onClick={handleStartConversation}
              className="w-full bg-sky-400 text-primary-foreground py-3 px-5 rounded-xl font-medium shadow-md hover:shadow-lg transition flex items-center justify-center gap-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {loadingConversation ? (
                <VscLoading className="animate-spin size-6" />
              ) : (
                <div className="flex items-center gap-1">
                  <BiSolidMessageSquareDetail className="w-4 h-4" />
                  {t("contactCenter")}
                </div>
              )}
            </motion.button>

            {organization.booking_status === 1 && (
              <motion.button
                onClick={handleBookAppointment}
                className="w-full bg-primary text-white py-3 px-5 rounded-xl font-medium shadow-md hover:shadow-lg transition flex flex-col items-center"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center gap-2">
                  <FaCalendarAlt className="w-4 h-4" />
                  {t("bookAppointment")}
                </div>
                {organization.confirmation_status === 1 && (
                  <span className="text-xs opacity-80 mt-1">
                    {t("startingAt")} ${organization.confirmation_price}
                  </span>
                )}
              </motion.button>
            )}
          </div>
        </div>
      </motion.aside>
    </>
  );
}
