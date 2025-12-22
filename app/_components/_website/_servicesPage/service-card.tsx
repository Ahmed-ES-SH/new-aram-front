"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { FiStar, FiShoppingBag } from "react-icons/fi";
import { Service } from "./service";
import LocaleLink from "../_global/LocaleLink";
import { formatTitle, truncateContent } from "@/app/_helpers/helpers";
import Img from "../_global/Img";

interface ServiceCardProps {
  service: Service;
  locale: string;
  index: number;
}

// Service card component with hover and fade animations
export default function PublicServiceCard({
  service,
  locale,
  index,
}: ServiceCardProps) {
  const t = useTranslations("servicesPage.serviceCard");
  const hasDiscount =
    Number(service.price_before_discount) > Number(service.price);

  const discount_percentage =
    (Number(service.price) / Number(service.price_before_discount)) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -8, transition: { duration: 0.2 } }}
      className="bg-white rounded-2xl overflow-hidden shadow-lg shadow-gray-100 border border-gray-100 group flex flex-col"
    >
      {/* Service image with badges */}
      <div className="relative h-64 overflow-hidden">
        <Img
          src={service?.image ?? "/defaults/noImage.png"}
          alt={service?.title ?? "alt"}
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
        {discount_percentage.toFixed(2) && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.4 }}
            className="absolute top-3 end-3 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full"
          >
            {discount_percentage.toFixed(2)}% {t("off")}
          </motion.div>
        )}
      </div>

      {/* Card content */}
      <div className="p-5 flex-1 flex flex-col">
        {/* Category */}
        <span className="text-xs text-teal-600 font-medium uppercase tracking-wide">
          {locale === "ar"
            ? service.category.title_ar
            : service.category.title_en}
        </span>

        {/* Title */}
        <LocaleLink
          href={`/services/${formatTitle(service.slug)}?serviceId=${
            service.id
          }`}
          className="text-lg hover:text-primary hover:underline duration-300 font-semibold text-gray-900 mt-2 mb-2 line-clamp-2"
        >
          {service.slug}
        </LocaleLink>

        {/* Description */}
        <p className="text-sm text-gray-500 mb-4 line-clamp-2 flex-1">
          {truncateContent(service.description, 100)}
        </p>

        {/* Price Section - Integrated with rating */}
        <div className="mt-auto pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between">
            {/* Rating and orders */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <FiStar className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span className="text-sm font-medium text-gray-900">
                  {service?.rating && service?.rating?.toFixed(1)}
                </span>
              </div>
              <div className="flex items-center gap-1 text-gray-500">
                <FiShoppingBag className="w-4 h-4" />
                <span className="text-sm">
                  {service?.orders_count ?? 0} {t("orders")}
                </span>
              </div>
            </div>

            {/* Price display */}
            <div className="text-right">
              {hasDiscount ? (
                <>
                  <div className="flex items-center justify-end gap-2">
                    <span className="text-lg font-bold text-primary">
                      {service.price}
                    </span>
                    <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
                      -{discount_percentage.toFixed(2)}%
                    </span>
                  </div>
                  <div className="mt-0.5">
                    <span className="text-sm text-gray-400 line-through">
                      {service.price_before_discount}
                    </span>
                  </div>
                </>
              ) : (
                <span className="text-lg font-bold text-gray-800">
                  {service.price}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
