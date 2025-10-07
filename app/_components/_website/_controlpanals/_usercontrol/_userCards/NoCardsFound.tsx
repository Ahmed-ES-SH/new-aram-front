"use client";

import { motion } from "framer-motion";
import { FaRegCreditCard } from "react-icons/fa";
import { useTranslations } from "next-intl";
import LocaleLink from "../../../_global/LocaleLink";

export default function NoCardsFound() {
  const t = useTranslations("noCards");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="flex flex-col items-center justify-center w-full min-h-[80vh] text-center"
    >
      {/* Icon Section */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 10 }}
        className="bg-orange-100 p-6 rounded-full mb-6 shadow-md"
      >
        <FaRegCreditCard className="text-orange-500 text-5xl" />
      </motion.div>

      {/* Title */}
      <motion.h2
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-2xl font-semibold text-gray-800"
      >
        {t("title")}
      </motion.h2>

      {/* Description */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-gray-500 mt-3 max-w-md"
      >
        {t("description")}
      </motion.p>

      {/* CTA Button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-6"
      >
        <LocaleLink
          href="/cards"
          className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-medium px-6 py-3 rounded-2xl transition-all shadow-md hover:shadow-lg"
        >
          <FaRegCreditCard className="text-lg" />
          {t("button")}
        </LocaleLink>
      </motion.div>
    </motion.div>
  );
}
