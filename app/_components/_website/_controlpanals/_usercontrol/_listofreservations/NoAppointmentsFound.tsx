"use client";

import { motion } from "framer-motion";
import { FaCalendarTimes } from "react-icons/fa";
import { useTranslations } from "next-intl";
import LocaleLink from "../../../_global/LocaleLink";

export default function NoAppointmentsFound() {
  const t = useTranslations("noAppointments");

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="flex flex-col items-center justify-center min-h-[80vh] w-full text-center space-y-6 px-4"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
        className="flex items-center justify-center w-24 h-24 bg-orange-100 text-orange-500 rounded-full shadow-md"
      >
        <FaCalendarTimes className="text-5xl" />
      </motion.div>

      <div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          {t("title")}
        </h2>
        <p className="text-gray-500 max-w-md mx-auto">{t("description")}</p>
      </div>

      <motion.div whileHover={{ scale: 1.05 }}>
        <LocaleLink
          href="/organizations"
          className="inline-block bg-orange-500 text-white px-6 py-3 rounded-full font-medium shadow-md hover:bg-orange-600 transition-colors"
        >
          {t("button")}
        </LocaleLink>
      </motion.div>
    </motion.div>
  );
}
