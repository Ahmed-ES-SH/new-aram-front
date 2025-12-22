"use client";

import { motion } from "framer-motion";
import { FaTimes, FaTag, FaClock, FaInfinity } from "react-icons/fa";
import { useTranslations } from "next-intl";
import Img from "../../../_global/Img";
import { CiCreditCard1 } from "react-icons/ci";

interface CouponPopupProps {
  coupon: {
    title: string;
    description: string;
    image: string;
    code: string;
    discount_value: string;
    benefit_type: string;
    start_date: string;
    end_date: string;
    usage_limit: number | null;
    usage_count: number;
    status: string;
  };
  onClose: () => void;
}

export default function CouponPopup({ coupon, onClose }: CouponPopupProps) {
  const t = useTranslations("couponPopup");

  return (
    <motion.div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-[99] p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="relative bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden"
      >
        {/* Header Image */}
        <div className="relative h-72 overflow-y-auto w-full">
          <Img
            src={coupon.image}
            alt={coupon.title}
            className="object-cover w-full h-full"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-white/80 hover:bg-white text-gray-700 p-2 rounded-full shadow-md"
          >
            <FaTimes size={16} />
          </button>

          <div className="absolute bottom-4 left-4 text-white">
            <h3 className="text-xl font-bold">{coupon.title}</h3>
            <p className="text-sm text-gray-200">{coupon.code}</p>
          </div>
        </div>

        {/* Details Section */}
        <div className="p-6 space-y-4">
          <p className="text-gray-600 leading-relaxed">{coupon.description}</p>

          <div className="flex flex-col items-start gap-3">
            <div className="flex items-center gap-2 w-full bg-blue-50 rounded-lg p-3">
              <FaTag className="text-blue-600" />
              <div className="w-full">
                <p className="text-xs text-gray-500">{t("discount")}</p>
                <p className="font-medium text-gray-800">
                  {coupon.benefit_type === "fixed" ? (
                    `$${coupon.discount_value}`
                  ) : coupon.benefit_type == "free_card" ? (
                    <div className="flex items-center gap-1">
                      <CiCreditCard1 /> {t("freeCard")}
                    </div>
                  ) : (
                    `${coupon.discount_value}%`
                  )}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full bg-green-50 rounded-lg p-3">
              <FaClock className="text-green-600" />
              <div className="w-full">
                <p className="text-xs text-gray-500">{t("period")}</p>
                <p className="font-medium text-gray-800">
                  {coupon.start_date.split(" ")[0]} →{" "}
                  {coupon.end_date.split(" ")[0]}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full bg-yellow-50 rounded-lg p-3">
              <FaInfinity className="text-yellow-600" />
              <div className="w-full">
                <p className="text-xs text-gray-500">{t("usage")}</p>
                <p className="font-medium text-gray-800">
                  {coupon.usage_limit
                    ? `${coupon.usage_count}/${coupon.usage_limit}`
                    : t("unlimited")}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full bg-purple-50 rounded-lg p-3">
              <div className="w-3 h-3 rounded-full bg-purple-500"></div>
              <div className="w-full">
                <p className="text-xs text-gray-500">{t("status")}</p>
                <p className="font-medium text-gray-800 capitalize">
                  {coupon.status}
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
