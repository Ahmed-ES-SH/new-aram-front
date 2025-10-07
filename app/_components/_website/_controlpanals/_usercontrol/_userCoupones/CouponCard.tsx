"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { FaTag, FaClock, FaCopy, FaInfinity } from "react-icons/fa";
import { useState } from "react";
import CouponPopup from "./CouponPopup";
import { BsEye } from "react-icons/bs";
import { CiCreditCard1 } from "react-icons/ci";
import { truncateContent } from "@/app/_helpers/helpers";
import Img from "../../../_global/Img";

interface CouponProps {
  coupon: {
    id: number;
    title: string;
    description: string;
    image: string;
    code: string;
    type: string;
    benefit_type: string;
    discount_value: string;
    start_date: string;
    end_date: string;
    status: string;
    usage_limit: number | null;
    usage_count: number;
  };
}

export default function CouponCard({ coupon }: CouponProps) {
  const t = useTranslations("couponCard");
  const [copied, setCopied] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(coupon.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const total = coupon.usage_limit ?? 0;
  const used = coupon.usage_count;
  const percentage = total > 0 ? Math.min((used / total) * 100, 100) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="relative group  bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow duration-300 w-full"
    >
      {/* Coupon Image */}
      <div className="relative h-64 w-full overflow-hidden">
        <Img
          src={coupon.image}
          alt={coupon.title}
          className="object-cover w-full h-full hover:scale-105 transition-transform duration-500"
        />
        {coupon.status === "active" && (
          <span className="absolute top-3 left-3 bg-green-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
            {t("active")}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-5 space-y-3">
        <div className="flex items-center justify-between relative w-full">
          <h2 className="text-lg font-bold text-gray-800">{coupon.title}</h2>
          <div
            onClick={() => setShowPopup(true)}
            className="size-8 absolute top-1/2 ltr:-right-14 group-hover:ltr:right-0 rtl:-left-14 group-hover:rtl:left-0 -translate-y-1/2  cursor-pointer duration-300 hover:bg-primary hover:text-white flex items-center justify-center border rounded-full"
          >
            <BsEye className="size-6" />
          </div>
        </div>
        <p className="text-sm text-gray-500 line-clamp-2">
          {truncateContent(coupon.description, 80)}
        </p>

        {/* Discount + Copy */}
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-2 text-blue-600 font-medium">
            {coupon.benefit_type != "free_card" && <FaTag />}
            {coupon.benefit_type === "fixed" ? (
              <span>{`${t("discountValue")} $${coupon.discount_value}`}</span>
            ) : coupon.benefit_type == "free_card" ? (
              <div className="flex items-center gap-1">
                <CiCreditCard1 /> {t("freeCard")}
              </div>
            ) : (
              <span>
                {coupon.discount_value}% {t("off")}
              </span>
            )}
          </div>

          <div
            onClick={handleCopy}
            className={`cursor-pointer flex items-center gap-1  hover:bg-gray-200 px-3 py-1 rounded-md text-sm font-medium duration-300 ${
              copied ? "bg-green-400 text-white" : "text-gray-700 bg-gray-100"
            }`}
          >
            <FaCopy size={14} />
            {copied ? t("copied") : t("copy")}
          </div>
        </div>

        {/* Dates */}
        <div className="flex items-center justify-between text-xs text-gray-500 mt-4">
          <div className="flex items-center gap-1">
            <FaClock />
            <span>
              {t("from")} {coupon.start_date.split(" ")[0]}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <FaClock />
            <span>
              {t("to")} {coupon.end_date.split(" ")[0]}
            </span>
          </div>
        </div>

        {/* Usage Progress */}
        <div className="mt-5">
          <div className="flex justify-between text-xs font-medium text-gray-600 mb-1">
            <span>{t("usage")}</span>
            {coupon.usage_limit ? (
              <span>
                {used}/{coupon.usage_limit}
              </span>
            ) : (
              <span className="flex items-center gap-1">
                <FaInfinity size={10} /> {t("unlimited")}
              </span>
            )}
          </div>

          <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${percentage}%` }}
              transition={{ duration: 0.6 }}
              className={`h-2 rounded-full ${
                percentage < 60
                  ? "bg-blue-500"
                  : percentage < 90
                  ? "bg-yellow-500"
                  : "bg-red-500"
              }`}
            />
          </div>
        </div>

        {/* Coupon Code */}
        <div className="mt-4 bg-blue-50 border border-dashed border-blue-400 text-blue-800 text-center py-2 rounded-lg font-semibold text-sm tracking-wide">
          {coupon.code}
        </div>
      </div>

      {/* Hover Popup */}
      {showPopup && (
        <CouponPopup onClose={() => setShowPopup(false)} coupon={coupon} />
      )}
    </motion.div>
  );
}
