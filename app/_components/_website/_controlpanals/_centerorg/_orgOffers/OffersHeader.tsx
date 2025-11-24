"use client";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { FaPlus } from "react-icons/fa6";
import LocaleLink from "../../../_global/LocaleLink";
import { useAppSelector } from "@/app/Store/hooks";

export default function OffersHeader() {
  const { user } = useAppSelector((state) => state.user);
  const t = useTranslations("offersHeader");

  return (
    <motion.header
      initial={{ opacity: 0, y: -15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex items-center max-md:flex-col max-md:items-start justify-between gap-3 bg-white  p-5 mb-6"
    >
      {/* Titles Section */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-1">{t("title")}</h1>
        <p className="text-gray-500 text-sm">{t("subtitle")}</p>
      </div>

      {/* Action Button */}
      <motion.div
        className="self-end"
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
      >
        <LocaleLink
          href={`/centercontrolpanel/addoffer?account_type=${user?.account_type}&account_name=${user?.title}&userId=${user?.id}`}
          className="flex items-center w-fit gap-2 bg-primary hover:bg-primary/90 text-white font-medium px-4 py-2 rounded-xl shadow-sm"
        >
          <FaPlus className="w-4 h-4" />
          {t("addButton")}
        </LocaleLink>
      </motion.div>
    </motion.header>
  );
}
