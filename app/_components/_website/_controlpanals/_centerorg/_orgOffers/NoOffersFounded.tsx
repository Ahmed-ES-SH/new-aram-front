"use client";
import { motion } from "framer-motion";
import { FiPackage } from "react-icons/fi";
import { useTranslations } from "next-intl";

export default function NoOffersFounded() {
  const t = useTranslations("noOffers");

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-center text-center py-24 px-4 bg-white w-full min-h-[90vh] rounded-2xl"
    >
      <div className="flex flex-col gap-4 items-center">
        {/* Icon */}
        <div className="bg-primary/10 text-primary p-6 rounded-full mb-6">
          <FiPackage className="w-16 h-16" />
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-800 mb-2">{t("title")}</h2>

        {/* Subtitle */}
        <p className="text-gray-500 max-w-md">{t("subtitle")}</p>
      </div>
    </motion.div>
  );
}
