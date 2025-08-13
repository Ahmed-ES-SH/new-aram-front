"use client";

import { motion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { Card } from "./types";
import { LuCreditCard, LuGift, LuTag } from "react-icons/lu";
import { directionMap } from "@/app/constants/_website/global";
import Img from "../../_website/_global/Img";

interface CardComponentProps {
  card: Card;
}

export default function CardComponent({ card }: CardComponentProps) {
  const t = useTranslations("cards");
  const locale = useLocale();

  // Generate a gradient based on card ID for variety
  //   const gradients = [
  //     "from-blue-600 via-blue-700 to-blue-800",
  //     "from-purple-600 via-purple-700 to-purple-800",
  //     "from-green-600 via-green-700 to-green-800",
  //     "from-red-600 via-red-700 to-red-800",
  //     "from-indigo-600 via-indigo-700 to-indigo-800",
  //     "from-pink-600 via-pink-700 to-pink-800",
  //   ];

  //   const cardGradient = gradients[card.id % gradients.length];

  return (
    <motion.div
      dir={directionMap[locale]}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full group cursor-pointer overflow-hidden border border-gray-300 rounded-lg shadow max-w-sm mx-auto"
    >
      {/* Credit Card */}
      <div
        style={{ background: `url(${card.image})` }}
        className={`relative w-full  aspect-[16/10] bg-gradient-to-br  shadow-2xl overflow-hidden transform  transition-transform duration-300`}
      >
        {/* Card Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -translate-y-16 translate-x-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full translate-y-12 -translate-x-12"></div>
        </div>

        {/* Card Content */}
        <div className="relative h-full p-6 flex flex-col justify-between text-white">
          {/* Top Row - Chip and Brand */}
          <div className="flex justify-between items-start">
            {/* Chip */}
            <div className="w-12 h-9 bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-md flex items-center justify-center shadow-lg">
              <Img src="/logo.png" className="w-10 object-contain" />
            </div>

            {/* Brand/Type */}
            <div className="text-right">
              <div className="text-xs font-medium opacity-80">
                {t("premium")}
              </div>
              <LuCreditCard className="w-8 h-8 mt-1 opacity-90" />
            </div>
          </div>

          {/* Middle Row - Card Number (Price) */}
          <div className="space-y-2">
            <div className="text-sm font-mono font-bold tracking-wider">
              XXXX XXXX XXXX XXXX
            </div>
            {card.price_before_discount && (
              <div className="text-sm opacity-75 line-through">
                {card.price_before_discount}
              </div>
            )}
          </div>

          {/* Bottom Row - Name and Expiry */}
          <div className="flex justify-between items-end">
            <div>
              <div className="text-xs opacity-75 uppercase tracking-wide">
                {t("cardHolder")}
              </div>
              <div className="font-semibold text-sm uppercase tracking-wide truncate max-w-[180px]">
                jone dee
              </div>
            </div>

            <div className="text-right">
              <div className="text-xs opacity-75 uppercase tracking-wide">
                {t("validThru")}
              </div>
              <div className="font-mono text-sm">{card.duration}</div>
            </div>
          </div>
        </div>

        {/* Holographic Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 hover:opacity-10 transform -skew-x-12 translate-x-full hover:translate-x-[-100%] transition-all duration-1000"></div>
      </div>

      {/* Card Details Below */}
      <div className="mt-6 space-y-4 p-2">
        {/* title */}

        <h3 className="font-semibold group-hover:underline group-hover:text-blue-600 duration-100">
          {card.title}
        </h3>

        {/* Description */}
        <p className="text-gray-600 text-sm leading-relaxed">
          {card.description.length > 50
            ? card.description.slice(0, 50) + "..."
            : card.description}
        </p>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2 text-blue-600">
            <LuTag className="w-4 h-4" />
            <span>
              {t("keywords")}: {card.keywords_count}
            </span>
          </div>
          <div className="flex items-center gap-2 text-orange-600">
            <LuGift className="w-4 h-4" />
            <span>
              {t("benefits")}: {card.benefits_count}
            </span>
          </div>
        </div>

        {/* Keywords */}
        {card.keywords && card.keywords.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
              <LuTag className="w-4 h-4" />
              {t("keywords")}:
            </h4>
            <div className="flex flex-wrap gap-2">
              {card.keywords.map((keyword) => (
                <span
                  key={keyword.id}
                  className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full border"
                >
                  {keyword.title}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
