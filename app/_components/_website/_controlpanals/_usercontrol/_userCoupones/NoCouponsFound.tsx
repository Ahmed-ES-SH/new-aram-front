"use client";

import { motion } from "framer-motion";
import { FaTicketAlt } from "react-icons/fa";
import { useTranslations } from "next-intl";

export default function NoCouponsFound() {
  const t = useTranslations("noCoupons");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="flex flex-col items-center justify-center w-full min-h-[80vh] text-center"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 10 }}
        className="bg-orange-100 p-6 rounded-full mb-6 shadow-md"
      >
        <FaTicketAlt className="text-orange-500 text-5xl" />
      </motion.div>

      <motion.h2
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-2xl font-semibold text-gray-800"
      >
        {t("title")}
      </motion.h2>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-gray-500 mt-3 max-w-md"
      >
        {t("description")}
      </motion.p>
    </motion.div>
  );
}
