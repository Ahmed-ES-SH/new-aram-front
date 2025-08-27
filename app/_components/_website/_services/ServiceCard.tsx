"use client";
import React from "react";
import { motion } from "framer-motion";
import { FiStar, FiShoppingBag, FiPercent, FiTag } from "react-icons/fi";
import { Service } from "../../_dashboard/_services/types";
import Img from "../_global/Img";
import { useLocale, useTranslations } from "next-intl";
import { IoEyeOutline } from "react-icons/io5";

interface props {
  service: Service;
  index: number;
}

export default function ServiceCard({ service, index }: props) {
  const locale = useLocale();
  const t = useTranslations("services");

  const renderDiscountBadge = (service: Service) => {
    if (service.benefit_type === "percentage" && service.discount_percentage) {
      return (
        <div className="absolute top-4 left-4 bg-primary text-white px-4 py-2 rounded-full text-sm font-medium flex items-center gap-1">
          <FiPercent className="w-3 h-3" />
          {service.discount_percentage}% {t("discount")}
        </div>
      );
    }
    if (service.benefit_type === "fixed" && service.discount_price) {
      return (
        <div className="absolute top-4 left-4 bg-primary text-white px-4 py-2 rounded-full text-sm font-medium flex items-center gap-1">
          <FiTag className="w-3 h-3" />${service.discount_price} {t("discount")}
        </div>
      );
    }
    return null;
  };

  return (
    <>
      <motion.div
        key={service.id}
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        viewport={{ once: true }}
        className="bg-white rounded-xl h-full shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl hover:-translate-y-4 duration-300"
      >
        <div className="relative">
          <Img
            src={service.image || "/placeholder.png"}
            alt={service.title}
            className="w-full h-48 object-cover"
          />
          {renderDiscountBadge(service)}
          {service.is_exclusive === 1 && (
            <div className="absolute top-4 right-4 bg-purple-500 text-white px-3 py-1 rounded-full text-sm font-medium">
              {t("exclusive")}
            </div>
          )}
        </div>

        <div className="p-6">
          <div className="mb-3 space-y-4">
            <h3 className="text-xl font-bold text-gray-900 text-balance">
              {service.title}
            </h3>
            <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 w-fit rtl:mr-auto ltr:ml-auto rounded-full">
              <FiStar className="w-3 h-3 text-yellow-500 fill-current" />
              <span className="text-sm font-medium text-yellow-700">
                {service.rating}
              </span>
            </div>
          </div>

          <p className="text-gray-600 text-sm mb-4 leading-relaxed">
            {service.description.length > 100
              ? service.description.substring(0, 100) + "..."
              : service.description}
          </p>

          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <FiShoppingBag className="w-4 h-4" />
              <span>
                {service.orders_count} {t("ordersText")}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 mb-4">
            <Img
              src={service.creater.image || "/placeholder.png"}
              alt={service.creater.name}
              className="w-6 h-6 rounded-full"
            />
            <span className="text-sm text-gray-600">
              {service.creater.name}
            </span>
          </div>

          <div
            className="inline-block px-3 py-1 rounded-full text-xs font-medium text-white mb-4"
            style={{ backgroundColor: service.category.bg_color }}
          >
            {locale === "ar"
              ? service.category.title_ar
              : service.category.title_en}
          </div>

          <div className="flex flex-wrap gap-1 mb-6">
            {service.keywords.slice(0, 3).map((keyword) => (
              <span
                key={keyword.id}
                className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full"
              >
                {keyword.title}
              </span>
            ))}
          </div>

          <button className="w-full  bg-primary hover:bg-orange-500 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 group">
            {t("view")}
            <IoEyeOutline className="w-4 h-4  transition-transform duration-200" />
          </button>
        </div>
      </motion.div>
    </>
  );
}
