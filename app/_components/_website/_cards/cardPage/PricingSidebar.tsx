"use client";

import { motion } from "framer-motion";
import {
  FaClock,
  FaCheckCircle,
  FaStar,
  FaShoppingCart,
  FaGift,
} from "react-icons/fa";
import { BiSolidOffer } from "react-icons/bi";
import { HiSparkles } from "react-icons/hi2";
import { IoMdPricetag } from "react-icons/io";
import { MembershipCard } from "../../_global/_memberShipCard-v2/membership-card";
import { PricingSidebarProps } from "./types";

export default function PricingSidebar({
  card,
  locale,
  t,
  activeCurrency,
  discountPercentage,
  savedPrice,
  isInCart,
  onAddToCart,
  onCouponClick,
}: PricingSidebarProps) {
  return (
    <div className="lg:col-span-1">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="sticky top-28"
      >
        <div className="bg-white rounded-3xl shadow-2xl shadow-slate-200/70 border border-slate-100 overflow-hidden">
          {/* Membership Card Preview */}
          <div className="p-4">
            <MembershipCard data={card} />
          </div>

          {/* Discount Banner */}
          {discountPercentage > 0 && (
            <div className="bg-linear-to-r from-rose-500 via-pink-500 to-rose-500 px-6 py-3 flex items-center justify-center gap-2">
              <HiSparkles className="text-white text-lg" />
              <span className="text-white font-bold">
                {locale === "en"
                  ? `Save ${discountPercentage}% Today!`
                  : `وفر ${discountPercentage}% اليوم!`}
              </span>
              <HiSparkles className="text-white text-lg" />
            </div>
          )}

          <div className="p-6 space-y-6">
            {/* Price Section */}
            <div className="text-center py-4 px-6 rounded-2xl bg-linear-to-br from-slate-50 to-slate-100 border border-slate-200">
              <div className="flex items-center justify-center gap-3 mb-2">
                <span className="text-2xl text-slate-400 line-through font-medium">
                  {Number(
                    Number(activeCurrency?.exchange_rate) *
                      Number(card.price_before_discount)
                  ).toFixed(2)}
                </span>
                <span className="text-slate-400">{activeCurrency?.symbol}</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <span className="text-5xl font-black bg-linear-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  {Number(
                    Number(activeCurrency?.exchange_rate) * Number(card.price)
                  ).toFixed(2)}
                </span>
                <span className="text-2xl font-bold text-slate-600">
                  {activeCurrency?.symbol}
                </span>
              </div>
            </div>

            {/* Savings Badge */}
            <div className="flex items-center justify-center">
              <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-linear-to-r from-amber-100 to-orange-100 border border-amber-200">
                <IoMdPricetag className="text-amber-600" />
                <span className="font-semibold text-amber-700">
                  {t("save")}{" "}
                  {Number(
                    Number(activeCurrency?.exchange_rate) * Number(savedPrice)
                  ).toFixed(2)}{" "}
                  {activeCurrency?.symbol}
                </span>
              </div>
            </div>

            {/* Duration */}
            <div className="flex items-center justify-center gap-3 p-4 rounded-2xl bg-blue-50 border border-blue-100">
              <FaClock className="text-blue-500 text-xl" />
              <span className="text-blue-700 font-medium">
                {t("duration")}: {card.duration}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-2">
              {/* Add to Cart Button */}
              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={onAddToCart}
                disabled={isInCart}
                className={`w-full py-4 px-6 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all duration-300 ${
                  isInCart
                    ? "bg-linear-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/30"
                    : "bg-linear-to-r from-slate-800 to-slate-900 text-white shadow-lg shadow-slate-800/30 hover:shadow-xl hover:shadow-slate-800/40"
                }`}
              >
                {isInCart ? (
                  <>
                    <FaCheckCircle className="text-xl" />
                    <span>
                      {locale === "en" ? "Added to Cart" : "تمت الإضافة"}
                    </span>
                  </>
                ) : (
                  <>
                    <FaShoppingCart className="text-xl" />
                    <span>{t("addToCart")}</span>
                  </>
                )}
              </motion.button>

              {/* Coupon Button */}
              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={onCouponClick}
                className="w-full py-4 px-6 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 bg-linear-to-r from-primary via-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/40 transition-all duration-300"
              >
                <BiSolidOffer className="text-2xl" />
                <span>
                  {locale === "en" ? "Have a Coupon?" : "لديك كوبون ؟"}
                </span>
              </motion.button>
            </div>

            {/* Trust Badges */}
            <div className="flex items-center justify-center gap-4 pt-4 border-t border-slate-100">
              <div className="flex items-center gap-1.5 text-slate-500 text-sm">
                <FaCheckCircle className="text-emerald-500" />
                <span>{locale === "en" ? "Secure" : "آمن"}</span>
              </div>
              <div className="w-1 h-1 rounded-full bg-slate-300" />
              <div className="flex items-center gap-1.5 text-slate-500 text-sm">
                <FaStar className="text-amber-500" />
                <span>{locale === "en" ? "Premium" : "مميز"}</span>
              </div>
              <div className="w-1 h-1 rounded-full bg-slate-300" />
              <div className="flex items-center gap-1.5 text-slate-500 text-sm">
                <FaGift className="text-rose-500" />
                <span>{locale === "en" ? "Exclusive" : "حصري"}</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
