"use client";

import { motion } from "framer-motion";
import { FiStar, FiShoppingBag } from "react-icons/fi";
import Image from "next/image";
import { fadeInUp, fadeIn, staggerContainer } from "./animation-variants";
import { useTranslations } from "next-intl";
import { Service } from "../../_dashboard/_services/types";

interface HeaderSectionProps {
  service: Service;
  locale: "en" | "ar";
}

export function HeaderSection({ service, locale }: HeaderSectionProps) {
  const t = useTranslations();
  const categoryTitle =
    locale === "ar" ? service.category.title_ar : service.category.title_en;

  return (
    <motion.section
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
      className="relative w-full"
    >
      {/* Main Image */}
      <motion.div
        variants={fadeIn}
        className="relative w-full h-64 sm:h-80 md:h-96 rounded-2xl overflow-hidden shadow-lg"
      >
        <Image
          src={service.image ?? "/defaults/noImage.png"}
          alt={service.title}
          fill
          className="object-cover"
          priority
        />

        {/* Exclusive Badge */}
        {service.is_exclusive && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            className="absolute top-4 left-4 bg-linear-to-r from-amber-500 to-orange-500 text-white px-4 py-1.5 rounded-full text-sm font-semibold shadow-md"
          >
            {t("service.exclusive")}
          </motion.div>
        )}

        {/* Discount Badge */}
        {service.discount_percentage && service.discount_percentage > 0 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.4 }}
            className="absolute top-4 right-4 bg-emerald-500 text-white px-4 py-1.5 rounded-full text-sm font-semibold shadow-md"
          >
            {service.discount_percentage}% {t("service.discount")}
          </motion.div>
        )}
      </motion.div>

      {/* Service Info */}
      <div className="mt-6 space-y-4">
        {/* Category */}
        <motion.div variants={fadeInUp} className="flex items-center gap-2">
          <div className="relative w-6 h-6 rounded-full overflow-hidden">
            <Image
              src={service.category.image ?? "/defaults/noImage.png"}
              alt={categoryTitle}
              fill
              className="object-cover"
            />
          </div>
          <span className="text-sm text-gray-500 font-medium">
            {categoryTitle}
          </span>
        </motion.div>

        {/* Title */}
        <motion.h1
          variants={fadeInUp}
          className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 leading-tight"
        >
          {service.title}
        </motion.h1>

        {/* Stats Row */}
        <motion.div
          variants={fadeInUp}
          className="flex flex-wrap items-center gap-4 sm:gap-6"
        >
          {/* Rating */}
          <div className="flex items-center gap-1.5">
            <FiStar className="w-5 h-5 text-amber-400 fill-amber-400" />
            <span className="font-semibold text-gray-800">
              {service.rating.toFixed(1)}
            </span>
            <span className="text-gray-400 text-sm">/ 5.0</span>
          </div>

          {/* Divider */}
          <div className="w-px h-5 bg-gray-200" />

          {/* Orders Count */}
          <div className="flex items-center gap-1.5">
            <FiShoppingBag className="w-5 h-5 text-blue-500" />
            <span className="font-medium text-gray-700">
              {service.orders_count.toLocaleString()} {t("service.orders")}
            </span>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}
