"use client";

import { motion } from "framer-motion";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";
import { HiOutlineSparkles } from "react-icons/hi2";
import { useLocale } from "next-intl";

import Img from "../_global/Img";
import LocaleLink from "../_global/LocaleLink";

// Types for ServicePage data (matches backend response)
export interface ServicePageCategory {
  id: number;
  title_en: string;
  title_ar: string;
  icon_name?: string;
}

export interface ServicePageData {
  id: number;
  slug: string;
  is_active: boolean;
  title: string;
  image: string;
  price: string;
  price_before_discount: string | null;
  type: "service" | "product";
  category: ServicePageCategory;
  status: string;
  created_at: string;
  updated_at: string;
}

interface ServicePageUserCardProps {
  service: ServicePageData;
  variant?: "default" | "featured" | "compact";
}

export default function ServicePageUserCard({
  service,
  variant = "default",
}: ServicePageUserCardProps) {
  const locale = useLocale();
  const isRTL = locale === "ar";

  // Calculate discount percentage
  const hasDiscount =
    service.price_before_discount &&
    parseFloat(service.price_before_discount) > parseFloat(service.price);

  const discountPercentage = hasDiscount
    ? Math.round(
        ((parseFloat(service.price_before_discount!) -
          parseFloat(service.price)) /
          parseFloat(service.price_before_discount!)) *
          100
      )
    : 0;

  const categoryTitle =
    locale === "ar" ? service.category.title_ar : service.category.title_en;

  // Featured variant - larger and more prominent
  if (variant === "featured") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="group relative"
      >
        <LocaleLink href={`/services/${service.slug}`}>
          <div className="relative h-[400px] rounded-3xl overflow-hidden">
            {/* Background Image */}
            <Img
              src={service.image || "/placeholder.png"}
              alt={service.title}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/40 to-transparent" />

            {/* Discount Badge */}
            {hasDiscount && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-4 right-4 flex items-center gap-1.5 px-4 py-2 bg-linear-to-r from-rose-500 to-pink-500 text-white rounded-full text-sm font-bold shadow-xl shadow-rose-500/30"
              >
                <HiOutlineSparkles className="w-4 h-4" />
                {discountPercentage}% خصم
              </motion.div>
            )}

            {/* Category Badge */}
            <div className="absolute top-4 left-4 px-4 py-2 bg-white/20 backdrop-blur-md text-white rounded-full text-sm font-medium border border-white/30">
              {categoryTitle}
            </div>

            {/* Content */}
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <div className="space-y-3">
                {/* Type Badge */}
                <span className="inline-block px-3 py-1 bg-primary/90 text-white text-xs font-medium rounded-full">
                  {service.type === "service" ? "خدمة" : "منتج"}
                </span>

                {/* Title */}
                <h3 className="text-2xl font-bold text-white leading-tight line-clamp-2">
                  {service.title}
                </h3>

                {/* Price Section */}
                <div className="flex items-center gap-3">
                  <span className="text-3xl font-bold text-white">
                    {service.price}
                    <span className="text-sm font-normal text-white/70 mr-1">
                      ر.ع
                    </span>
                  </span>
                  {hasDiscount && (
                    <span className="text-lg text-white/50 line-through">
                      {service.price_before_discount} ر.ع
                    </span>
                  )}
                </div>

                {/* CTA */}
                <div className="flex items-center gap-2 text-white/80 group-hover:text-primary transition-colors pt-2">
                  <span className="text-sm font-medium">عرض التفاصيل</span>
                  {isRTL ? (
                    <FiArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                  ) : (
                    <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  )}
                </div>
              </div>
            </div>
          </div>
        </LocaleLink>
      </motion.div>
    );
  }

  // Compact variant - smaller for grids
  if (variant === "compact") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.3 }}
        whileHover={{ y: -5 }}
        className="group"
      >
        <LocaleLink href={`/services/${service.slug}`}>
          <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100">
            {/* Image */}
            <div className="relative h-40 overflow-hidden">
              <Img
                src={service.image || "/placeholder.png"}
                alt={service.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              {hasDiscount && (
                <div className="absolute top-2 right-2 px-2 py-1 bg-rose-500 text-white rounded-md text-xs font-bold">
                  -{discountPercentage}%
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-4">
              <span className="text-xs text-primary font-medium">
                {categoryTitle}
              </span>
              <h3 className="font-semibold text-gray-900 mt-1 line-clamp-1 group-hover:text-primary transition-colors">
                {service.title}
              </h3>
              <div className="flex items-center gap-2 mt-2">
                <span className="font-bold text-gray-900">
                  {service.price} ر.ع
                </span>
                {hasDiscount && (
                  <span className="text-xs text-gray-400 line-through">
                    {service.price_before_discount}
                  </span>
                )}
              </div>
            </div>
          </div>
        </LocaleLink>
      </motion.div>
    );
  }

  // Default variant - balanced design
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -8 }}
      className="group"
    >
      <LocaleLink href={`/services/${service.slug}`}>
        <div className="relative bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100/50">
          {/* Image Container */}
          <div className="relative h-56 overflow-hidden">
            <Img
              src={service.image || "/placeholder.png"}
              alt={service.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />

            {/* Overlay on hover */}
            <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Badges */}
            <div className="absolute top-4 left-4 right-4 flex items-start justify-between">
              {/* Category */}
              <span className="px-3 py-1.5 bg-white/95 backdrop-blur-sm text-gray-800 rounded-full text-xs font-semibold shadow-lg">
                {categoryTitle}
              </span>

              {/* Discount */}
              {hasDiscount && (
                <motion.span
                  initial={{ rotate: -12 }}
                  whileHover={{ rotate: 0, scale: 1.1 }}
                  className="px-3 py-1.5 bg-linear-to-r from-rose-500 to-pink-500 text-white rounded-full text-xs font-bold shadow-lg"
                >
                  {discountPercentage}% خصم
                </motion.span>
              )}
            </div>

            {/* Type Badge (bottom left) */}
            <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white rounded-full text-xs font-medium shadow-lg">
                <HiOutlineSparkles className="w-3.5 h-3.5" />
                {service.type === "service" ? "خدمة" : "منتج"}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="p-5">
            {/* Title */}
            <h3 className="text-lg font-bold text-gray-900 line-clamp-2 leading-snug group-hover:text-primary transition-colors duration-300">
              {service.title}
            </h3>

            {/* Divider */}
            <div className="w-12 h-1 bg-linear-to-r from-primary to-primary/50 rounded-full mt-3 group-hover:w-full transition-all duration-500" />

            {/* Price Section */}
            <div className="flex items-end justify-between mt-4">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-gray-900">
                  {service.price}
                </span>
                <span className="text-sm text-gray-500">ر.ع</span>
                {hasDiscount && (
                  <span className="text-sm text-gray-400 line-through">
                    {service.price_before_discount}
                  </span>
                )}
              </div>

              {/* Arrow */}
              <div className="w-10 h-10 rounded-full bg-gray-100 group-hover:bg-primary flex items-center justify-center transition-all duration-300">
                {isRTL ? (
                  <FiArrowLeft className="w-5 h-5 text-gray-600 group-hover:text-white transition-colors" />
                ) : (
                  <FiArrowRight className="w-5 h-5 text-gray-600 group-hover:text-white transition-colors" />
                )}
              </div>
            </div>
          </div>

          {/* Bottom Accent Line */}
          <div className="h-1 bg-linear-to-r from-primary via-primary/70 to-primary/30 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
        </div>
      </LocaleLink>
    </motion.div>
  );
}
