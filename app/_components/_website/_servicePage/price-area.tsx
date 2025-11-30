"use client";

import { motion } from "framer-motion";
import { FiShoppingCart, FiZap, FiTag } from "react-icons/fi";
import { fadeInUp, hoverScale, tapScale } from "./animation-variants";
import { useLocale, useTranslations } from "next-intl";
import { Service } from "../../_dashboard/_services/types";
import { toast } from "sonner";

interface PriceAreaProps {
  service: Service;
}

export function PriceArea({ service }: PriceAreaProps) {
  const t = useTranslations();
  const locale = useLocale();

  const hasDiscount =
    service.discount_percentage && service.discount_percentage > 0;

  const handleNotWork = () => {
    toast.warning(
      locale == "ar"
        ? "هذا الميزة غير متوفرة حاليا"
        : "This feature is not available yet"
    );
  };

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={fadeInUp}
      className="bg-linear-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100"
    >
      <div className="space-y-4">
        {/* Exclusive Badge */}
        {service.is_exclusive && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-1.5 bg-linear-to-r from-amber-500 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-semibold"
          >
            <FiZap className="w-3 h-3" />
            {t("service.exclusive")}
          </motion.div>
        )}

        {/* Price Display */}
        <div className="flex items-end gap-3 flex-wrap">
          {/* Current Price */}
          <motion.div
            className="text-4xl sm:text-5xl font-bold text-gray-900"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
          >
            ${hasDiscount ? service.discount_price ?? 10 : service.price ?? 20}
          </motion.div>

          {/* Original Price (if discounted) */}
          {hasDiscount && (
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl text-gray-400 line-through">
                ${service.price ?? 20}
              </span>
              <span className="bg-emerald-100 text-emerald-700 text-sm font-semibold px-2 py-0.5 rounded-md flex items-center gap-1">
                <FiTag className="w-3 h-3" />
                {service.discount_percentage}% {t("service.discount")}
              </span>
            </div>
          )}
        </div>

        {/* Benefit Type */}
        {service.benefit_type && (
          <p className="text-sm text-gray-500">{service.benefit_type}</p>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <motion.button
            whileHover={hoverScale}
            whileTap={tapScale}
            onClick={handleNotWork}
            className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 px-6 rounded-xl transition-colors shadow-lg shadow-blue-500/25"
          >
            <FiShoppingCart className="w-5 h-5" />
            {t("service.addToCart")}
          </motion.button>

          <motion.button
            whileHover={hoverScale}
            whileTap={tapScale}
            onClick={handleNotWork}
            className="flex-1 flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-800 font-semibold py-3.5 px-6 rounded-xl border-2 border-gray-200 transition-colors"
          >
            <FiZap className="w-5 h-5" />
            {t("service.buyNow")}
          </motion.button>
        </div>
      </div>
    </motion.section>
  );
}
