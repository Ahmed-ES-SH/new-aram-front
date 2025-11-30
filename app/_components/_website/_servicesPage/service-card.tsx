"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { FiStar, FiShoppingBag } from "react-icons/fi";
import { Service } from "./service";
import LocaleLink from "../_global/LocaleLink";
import { formatTitle } from "@/app/_helpers/helpers";

interface ServiceCardProps {
  service: Service;
  locale: string;
  index: number;
}

// Service card component with hover and fade animations
export default function ServiceCard({
  service,
  locale,
  index,
}: ServiceCardProps) {
  const t = useTranslations("servicesPage.serviceCard");

  // Truncate description to a reasonable length
  const truncatedDescription =
    service.description.length > 100
      ? `${service.description.substring(0, 100)}...`
      : service.description;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -8, transition: { duration: 0.2 } }}
      className="bg-white rounded-2xl overflow-hidden shadow-lg shadow-gray-100 border border-gray-100 group"
    >
      {/* Service image with badges */}
      <div className="relative h-48 overflow-hidden">
        <Image
          src={service.image ?? "/defaults/noImage.png"}
          alt={service.title}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-500"
        />

        {/* Exclusive badge */}
        {service.is_exclusive === 1 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.3 }}
            className="absolute top-3 start-3 bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full"
          >
            {t("exclusive")}
          </motion.div>
        )}

        {/* Discount badge */}
        {service.discount_percentage && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.4 }}
            className="absolute top-3 end-3 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full"
          >
            {service.discount_percentage}% {t("off")}
          </motion.div>
        )}
      </div>

      {/* Card content */}
      <div className="p-5">
        {/* Category */}
        <span className="text-xs text-teal-600 font-medium uppercase tracking-wide">
          {locale === "ar"
            ? service.category.title_ar
            : service.category.title_en}
        </span>

        {/* Title */}
        <LocaleLink
          href={`/services/${formatTitle(service.title)}?serviceId=${
            service.id
          }`}
          className="text-lg hover:text-primary hover:underline duration-300 font-semibold text-gray-900 mt-2 mb-2 line-clamp-2"
        >
          {service.title}
        </LocaleLink>

        {/* Description */}
        <p className="text-sm text-gray-500 mb-4 line-clamp-2">
          {truncatedDescription}
        </p>

        {/* Keywords */}
        <div className="flex flex-wrap gap-2 mb-4">
          {service.keywords.slice(0, 3).map((keyword) => (
            <span
              key={keyword.id}
              className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-md"
            >
              {keyword.title}
            </span>
          ))}
        </div>

        {/* Rating and orders */}
        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center gap-1">
            <FiStar className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span className="text-sm font-medium text-gray-900">
              {service.rating.toFixed(1)}
            </span>
          </div>
          <div className="flex items-center gap-1 text-gray-500">
            <FiShoppingBag className="w-4 h-4" />
            <span className="text-sm">
              {service.orders_count} {t("orders")}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
